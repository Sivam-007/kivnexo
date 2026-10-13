
BEGIN;

-- 1. Create the Special Task submissions table
CREATE TABLE IF NOT EXISTS public.special_task_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_type text NOT NULL DEFAULT 'paytm_referral'
        CHECK (task_type = 'paytm_referral'),
    mobile_first_two text NOT NULL
        CHECK (mobile_first_two ~ '^[0-9]{2}$'),
    mobile_last_two text NOT NULL
        CHECK (mobile_last_two ~ '^[0-9]{2}$'),
    proof_details text NOT NULL
        CHECK (length(trim(proof_details)) BETWEEN 20 AND 2000),
    proof_url text,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reward_amount numeric(12,2),
    admin_notes text,
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (
        reward_amount IS NULL OR
        (reward_amount > 0 AND reward_amount <= 100000)
    )
);

-- 2. Enable row-level security
ALTER TABLE public.special_task_submissions
    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS special_tasks_select_own
    ON public.special_task_submissions;

CREATE POLICY special_tasks_select_own
ON public.special_task_submissions
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1
        FROM public.admin_users a
        WHERE a.user_id = (SELECT auth.uid())
    )
);

REVOKE ALL ON public.special_task_submissions FROM anon;
REVOKE ALL ON public.special_task_submissions FROM authenticated;
GRANT SELECT ON public.special_task_submissions TO authenticated;

-- 3. Allow users to submit their own Paytm referral proof
CREATE OR REPLACE FUNCTION public.submit_paytm_referral(
    p_mobile_first_two text,
    p_mobile_last_two text,
    p_proof_details text,
    p_proof_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id uuid;
    v_submission_id uuid;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF p_mobile_first_two IS NULL
       OR p_mobile_first_two !~ '^[0-9]{2}$'
       OR p_mobile_last_two IS NULL
       OR p_mobile_last_two !~ '^[0-9]{2}$' THEN
        RAISE EXCEPTION 'Enter valid first two and last two digits';
    END IF;

    IF p_proof_details IS NULL
       OR length(trim(p_proof_details)) < 20
       OR length(trim(p_proof_details)) > 2000 THEN
        RAISE EXCEPTION 'Proof details must be 20 to 2000 characters';
    END IF;

    IF p_proof_url IS NOT NULL
       AND length(p_proof_url) > 2048 THEN
        RAISE EXCEPTION 'Proof URL is too long';
    END IF;

    -- Prevent multiple pending submissions for this user/task.
    IF EXISTS (
        SELECT 1
        FROM public.special_task_submissions s
        WHERE s.user_id = v_user_id
          AND s.task_type = 'paytm_referral'
          AND s.status = 'pending'
    ) THEN
        RAISE EXCEPTION 'You already have a pending referral submission';
    END IF;

    INSERT INTO public.special_task_submissions (
        user_id,
        mobile_first_two,
        mobile_last_two,
        proof_details,
        proof_url
    )
    VALUES (
        v_user_id,
        p_mobile_first_two,
        p_mobile_last_two,
        trim(p_proof_details),
        NULLIF(trim(p_proof_url), '')
    )
    RETURNING id INTO v_submission_id;

    RETURN v_submission_id;
END;
$$;

-- 4. Admin-only review and one-time Special Wallet credit
CREATE OR REPLACE FUNCTION public.admin_review_special_task(
    p_submission_id uuid,
    p_action text,
    p_reward_amount numeric DEFAULT NULL,
    p_admin_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_id uuid;
    v_user_id uuid;
    v_status text;
    v_transaction_id uuid;
BEGIN
    v_admin_id := auth.uid();

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.admin_users a
        WHERE a.user_id = v_admin_id
    ) THEN
        RAISE EXCEPTION 'Admin access denied';
    END IF;

    IF p_action NOT IN ('approved', 'rejected') THEN
        RAISE EXCEPTION 'Action must be approved or rejected';
    END IF;

    IF p_admin_notes IS NOT NULL
       AND length(p_admin_notes) > 2000 THEN
        RAISE EXCEPTION 'Admin notes cannot exceed 2000 characters';
    END IF;

    IF p_action = 'approved' AND (
        p_reward_amount IS NULL
        OR p_reward_amount <= 0
        OR p_reward_amount > 100000
        OR p_reward_amount <> round(p_reward_amount, 2)
    ) THEN
        RAISE EXCEPTION 'Enter a valid reward amount';
    END IF;

    SELECT s.user_id, s.status
    INTO v_user_id, v_status
    FROM public.special_task_submissions s
    WHERE s.id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission not found';
    END IF;

    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'This submission has already been reviewed';
    END IF;

    IF p_action = 'approved' THEN
        -- Ensure the user's wallet exists.
        INSERT INTO public.wallets (user_id)
        VALUES (v_user_id)
        ON CONFLICT (user_id) DO NOTHING;

        -- Unique reference makes duplicate credits fail safely.
        INSERT INTO public.reward_transactions (
            user_id,
            wallet_type,
            amount,
            task_reference,
            verification_notes,
            credited_by,
            source_type
        )
        VALUES (
            v_user_id,
            'special',
            p_reward_amount,
            'SPECIAL_TASK:' || p_submission_id::text,
            COALESCE(p_admin_notes, 'Paytm referral task approved'),
            v_admin_id,
            'special_task'
        )
        RETURNING id INTO v_transaction_id;

        UPDATE public.wallets
        SET special_balance = special_balance + p_reward_amount,
            updated_at = now()
        WHERE user_id = v_user_id;
    END IF;

    UPDATE public.special_task_submissions
    SET status = p_action,
        reward_amount = CASE
            WHEN p_action = 'approved' THEN p_reward_amount
            ELSE NULL
        END,
        admin_notes = p_admin_notes,
        reviewed_by = v_admin_id,
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_submission_id;

    RETURN v_transaction_id;
END;
$$;

-- 5. Permit only authenticated users to call these functions.
REVOKE ALL ON FUNCTION public.submit_paytm_referral(
    text, text, text, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.submit_paytm_referral(
    text, text, text, text
) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_review_special_task(
    uuid, text, numeric, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_review_special_task(
    uuid, text, numeric, text
) TO authenticated;

-- 6. Add the new reward source type.
ALTER TABLE public.reward_transactions
    DROP CONSTRAINT IF EXISTS reward_transactions_source_type_check;

ALTER TABLE public.reward_transactions
    ADD CONSTRAINT reward_transactions_source_type_check
    CHECK (
        source_type = ANY (ARRAY[
            'admin',
            'promo_code',
            'offerwall',
            'survey',
            'spin_wheel',
            'watch_ad',
            'captcha',
            'withdrawal_refund',
            'special_task'
        ]::text[])
    );

-- Prevent duplicate ledger entries for a special-task submission.
CREATE UNIQUE INDEX IF NOT EXISTS
    reward_transactions_special_task_reference_key
ON public.reward_transactions (task_reference)
WHERE source_type = 'special_task';

COMMIT;
