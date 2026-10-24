
"use client";

import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  banner_image?: string;
  url: string;
};

type GameFeed = {
  items?: Game[];
};

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch(
          "https://feeds.gamepix.com/v2/json?sid=29O83&pagination=12&page=1"
        );

        if (!response.ok) {
          throw new Error("Game feed load aagala.");
        }

        const data: GameFeed = await response.json();
        setGames(data.items ?? []);
      } catch {
        setError("Games load aagala. Konjam neram kazhichu try pannunga.");
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  return (
    <main className="min-h-screen bg-[#070a0f] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <a
          href="/"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Back to Kivnexo
        </a>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Kivnexo Gaming
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
            Play Free Games
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Explore games and enjoy playing on Kivnexo.
          </p>
        </header>

        {selectedGame && (
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">{selectedGame.title}</h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              >
                Close Game
              </button>
            </div>

            <div className="overflow-hidden rounded-xl bg-black">
              <iframe
                key={selectedGame.id}
                src={selectedGame.url}
                title={selectedGame.title}
                className="h-[60vh] min-h-[350px] w-full border-0"
                allow="fullscreen; autoplay; gamepad"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              If a game does not open here, try opening it in a new tab.
            </p>
            <a
              href={selectedGame.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-emerald-400 underline"
            >
              Open game in a new tab
            </a>
          </section>
        )}

        {loading && (
          <p className="py-10 text-center text-gray-400">
            Loading games...
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/30 p-4 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && games.length === 0 && (
          <p className="text-gray-400">No games found.</p>
        )}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <article
              key={game.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#10151e] transition hover:border-emerald-400/60"
            >
              <img
                src={game.banner_image || game.image || ""}
                alt={game.title}
                className="aspect-video w-full bg-black object-cover"
                loading="lazy"
              />

              <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-semibold">
                  {game.title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {game.category || "Game"}
                </p>
                <button
                  onClick={() => setSelectedGame(game)}
                  className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-black transition hover:bg-emerald-300"
                >
                  Play Now
                </button>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-gray-500">
          Game content provided by GamePix. Availability may vary by game.
        </footer>
      </div>
    </main>
  );
}
