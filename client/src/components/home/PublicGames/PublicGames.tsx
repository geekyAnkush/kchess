import { getPublicGames } from "@/lib/game";
import JoinButton from "./JoinButton";
import RefreshButton from "./RefreshButton";

export default async function PublicGames() {
  const games = await getPublicGames();

  return (
    <div
      className="flex h-[88vh] w-screen items-center justify-center"
      style={{
        backgroundImage:
          " linear-gradient(to right top, rgba(22, 10, 75, 0.7), rgba(4, 4, 24, 0.8), rgba(63, 9, 78, 0.7))"
      }}
    >
      <div className="flex -translate-y-[8em] flex-col items-center gap-3">
        <h2 className="mb-2 text-2xl font-bold leading-tight">
          Public games <RefreshButton />
        </h2>

        <div className="bg-base-200 h-80 max-h-80 overflow-y-auto rounded-xl">
          <table className="table-compact lg:table-normal table-zebra table rounded-none">
            <thead>
              <tr>
                <th className="w-48">Host</th>
                <th className="w-48">Opponent</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody>
              {games && games.length > 0 ? (
                games.map((game) => (
                  <tr key={game.code} className="group">
                    <td>{game.host?.name}</td>
                    <td>
                      {(game.host?.id === game.white?.id ? game.black?.name : game.white?.name) ||
                        ""}
                    </td>
                    <th>
                      <JoinButton code={game.code as string} />
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>(empty)</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
