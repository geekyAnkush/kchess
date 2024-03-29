"use client";

import type { FormEvent } from "react";
import { useState, useContext } from "react";
import { SessionContext } from "@/context/session";
import { getGame } from "@/lib/game";
import { useRouter } from "next/navigation";

export default function JoinGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function submitJoinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const target = e.target as HTMLFormElement;
    const codeEl = target.elements.namedItem("joinGameCode") as HTMLInputElement;

    let code = codeEl.value;
    if (!code) return;

    setButtonLoading(true);

    if (code.startsWith("http") || code.startsWith("ches.su")) {
      code = new URL(code).pathname.split("/")[2];
    }

    const game = await getGame(code);

    if (game && game.code) {
      router.push(`/${game.code}`);
    } else {
      setButtonLoading(false);
      setNotFound(true);
      setTimeout(() => setNotFound(false), 5000);
      codeEl.value = "";
    }
  }

  return (
    <form
      className={
        "input-group !bg-slate-900" + (notFound ? " tooltip tooltip-error tooltip-open" : "")
      }
      data-tip="error: game not found"
      onSubmit={submitJoinGame}
    >
      <input
        type="text"
        placeholder="Invite link or code"
        className="input input-bordered !bg-slate-900"
        name="joinGameCode"
        id="joinGameCode"
      />
      <button
        className={
          "btn btn-square" +
          (buttonLoading ? " loading" : "") +
          (!session?.user?.id ? "btn-disabled" : "")
        }
        type="submit"
      >
        Join
      </button>
    </form>
  );
}
