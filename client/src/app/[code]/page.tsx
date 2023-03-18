import GameAuthWrapper from "@/components/game/GameAuthWrapper";
import { getGame } from "@/lib/game";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { code: string } }) {
  const game = await getGame(params.code);
  if (!game) {
    return {
      description: "Game not found",
      robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true
      }
    };
  }
  return {
    description: `Play or watch a game with ${game.host?.name}`,
    openGraph: {
      title: "kchess",
      description: `Play or watch a game with ${game.host?.name}`,
      url: `http://localhost:3000/${game.code}`,
      siteName: "kchess",
      locale: "en_US",
      type: "website"
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true
    }
  };
}

export default async function Game({ params }: { params: { code: string } }) {
  const game = await getGame(params.code);
  if (!game) {
    notFound();
  }

  return <GameAuthWrapper initialLobby={game} />;
}
