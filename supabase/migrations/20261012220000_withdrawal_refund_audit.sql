
BEGIN;

-- Allow withdrawal refund audit entries.
ALTER TABLE public.reward_transactions
DROP CONSTRAINT IF EXISTS reward_transactions_source_type_check;

ALTER TABLE public.reward_transactions
ADD CONSTRAINT reward_transactions_source_type_check
CHECK (
  source_type = ANY (
    ARRAY[
      'admin',
      'promo_code',
      'offerwall',
      'survey',
      'spin_wheel',
      'watch_ad',
      'captcha',
      'withdrawal_refund'
    ]::text[]
  )
);

-- Admin withdrawal review, refund and payout completion.
CREATE OR REPLACE FUNCTION public.admin_review_withdrawal(
    p_request_id uuid,
    p_action text,
    p_admin_notes text DEFAULT NULL::text,
    p_gift_card_code text DEFAULT NULL::text,
    p_payout_reference text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_admin_id uuid;
    v_request public.withdrawal_requests%ROWTYPE;
BEGIN
    v_admin_id := auth.uid();

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Login required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.admin_users AS au
        WHERE au.user_id = v_admin_id
    ) THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;

    IF p_request_id IS NULL
       OR p_action IS NULL
       OR p_action NOT IN ('approve', 'reject', 'complete') THEN
        RAISE EXCEPTION 'Invalid request or action';
    END IF;

    IF p_admin_notes IS NOT NULL
       AND pg_catalog.char_length(p_admin_notes) > 2000 THEN
        RAISE EXCEPTION 'Admin notes are too long';
    END IF;

    SELECT *
    INTO v_request
    FROM public.withdrawal_requests AS wr
    WHERE wr.id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Withdrawal request not found';
    END IF;

    IF v_request.wallet_type NOT IN ('normal', 'special') THEN
        RAISE EXCEPTION 'Invalid withdrawal wallet type';
    END IF;

    IF p_action = 'approve' THEN
        IF v_request.status <> 'pending' THEN
            RAISE EXCEPTION 'Only pending requests can be approved';
        END IF;

        IF p_gift_card_code IS NOT NULL
           OR p_payout_reference IS NOT NULL THEN
            RAISE EXCEPTION 'Payout details are not accepted during approval';
        END IF;

        UPDATE public.withdrawal_requests
        SET status = 'approved',
            reviewed_by = v_admin_id,
            reviewed_at = pg_catalog.now(),
            admin_notes = p_admin_notes,
            updated_at = pg_catalog.now()
        WHERE id = p_request_id;

    ELSIF p_action = 'reject' THEN
        IF v_request.status <> 'pending' THEN
            RAISE EXCEPTION 'Only pending requests can be rejected';
        END IF;

        IF p_gift_card_code IS NOT NULL
           OR p_payout_reference IS NOT NULL THEN
            RAISE EXCEPTION 'Payout details are not accepted during rejection';
        END IF;

        PERFORM 1
        FROM public.wallets AS w
        WHERE w.user_id = v_request.user_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'User wallet not found; refund not processed';
        END IF;

        -- Refund the original wallet.
        IF v_request.wallet_type = 'normal' THEN
            UPDATE public.wallets
            SET normal_balance = normal_balance + v_request.amount,
                updated_at = pg_catalog.now()
            WHERE user_id = v_request.user_id;
        ELSE
            UPDATE public.wallets
            SET special_balance = special_balance + v_request.amount,
                updated_at = pg_catalog.now()
            WHERE user_id = v_request.user_id;
        END IF;

        -- Record the refund in transaction history.
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
            v_request.user_id,
            v_request.wallet_type,
            v_request.amount,
            'WITHDRAWAL:' || p_request_id::text,
            'Withdrawal rejected and refunded. ' ||
                COALESCE(p_admin_notes, ''),
            v_admin_id,
            'withdrawal_refund'
        );

        UPDATE public.withdrawal_requests
        SET status = 'rejected',
            reviewed_by = v_admin_id,
            reviewed_at = pg_catalog.now(),
            refunded_at = pg_catalog.now(),
            admin_notes = p_admin_notes,
            updated_at = pg_catalog.now()
        WHERE id = p_request_id;

    ELSIF p_action = 'complete' THEN
        IF v_request.status <> 'approved' THEN
            RAISE EXCEPTION 'Only approved requests can be completed';
        END IF;

        IF v_request.withdrawal_method = 'google_play_gift_card' THEN
            IF NULLIF(pg_catalog.btrim(p_gift_card_code), '') IS NULL
               OR pg_catalog.char_length(p_gift_card_code) > 200 THEN
                RAISE EXCEPTION 'Gift card code is required';
            END IF;

            IF p_payout_reference IS NOT NULL THEN
                RAISE EXCEPTION 'Payout reference is not used for gift cards';
            END IF;
        ELSE
            IF NULLIF(pg_catalog.btrim(p_payout_reference), '') IS NULL
               OR pg_catalog.char_length(p_payout_reference) > 200 THEN
                RAISE EXCEPTION 'Verified UPI payout reference is required';
            END IF;

            IF p_gift_card_code IS NOT NULL THEN
                RAISE EXCEPTION 'Gift card code is not used for UPI';
            END IF;
        END IF;

        UPDATE public.withdrawal_requests
        SET status = 'completed',
            gift_card_code = CASE
                WHEN v_request.withdrawal_method = 'google_play_gift_card'
                THEN pg_catalog.btrim(p_gift_card_code)
                ELSE NULL
            END,
            payout_reference = CASE
                WHEN v_request.withdrawal_method = 'upi'
                THEN pg_catalog.btrim(p_payout_reference)
                ELSE NULL
            END,
            completed_by = v_admin_id,
            completed_at = pg_catalog.now(),
            admin_notes = COALESCE(p_admin_notes, admin_notes),
            updated_at = pg_catalog.now()
        WHERE id = p_request_id;
    END IF;

    RETURN p_request_id;
END;
$function$;

COMMIT;
