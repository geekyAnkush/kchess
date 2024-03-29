/* eslint-disable @next/next/no-img-element */
"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconPlayerSkipBack,
  IconPlayerSkipForward
} from "@tabler/icons-react";

// import whiteRook from "@/assets/whiteRook.jpeg";
// import blackRook from "@/assets/blackRook.jpeg";

import type { FormEvent, KeyboardEvent } from "react";

import { SessionContext } from "@/context/session";
import { useContext, useEffect, useReducer, useRef, useState } from "react";

import type { Message } from "@/types";
import type { Game } from "@chessu/types";

import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import type { ClearPremoves } from "react-chessboard";
import { Chessboard } from "react-chessboard";

import { API_URL } from "@/config";
import { io } from "socket.io-client";

import { lobbyReducer, squareReducer } from "./reducers";
import { initSocket } from "./socketEvents";
import { syncPgn, syncSide } from "./utils";

const socket = io(API_URL, { withCredentials: true, autoConnect: false });

export default function GamePage({ initialLobby }: { initialLobby: Game }) {
  const session = useContext(SessionContext);

  const [lobby, updateLobby] = useReducer(lobbyReducer, {
    ...initialLobby,
    actualGame: new Chess(),
    side: "s"
  });

  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    options: {},
    lastMove: {},
    rightClicked: {},
    check: {}
  });

  const [moveFrom, setMoveFrom] = useState<string | Square | null>(null);
  const [boardWidth, setBoardWidth] = useState(480);
  const chessboardRef = useRef<ClearPremoves>(null);

  const [navFen, setNavFen] = useState<string | null>(null);
  const [navIndex, setNavIndex] = useState<number | null>(null);

  const [playBtnLoading, setPlayBtnLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      author: {},
      message: `Welcome! You can invite friends to watch or play by sharing the link above. Have fun!`
    }
  ]);
  const chatListRef = useRef<HTMLUListElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user || !session.user?.id) return;
    socket.connect();

    window.addEventListener("resize", handleResize);
    handleResize();

    if (lobby.pgn && lobby.actualGame.pgn() !== lobby.pgn) {
      syncPgn(lobby.pgn, lobby, { updateCustomSquares, setNavFen, setNavIndex });
    }

    syncSide(session.user, undefined, lobby, { updateLobby });

    initSocket(session.user, socket, lobby, {
      updateLobby,
      addMessage,
      updateCustomSquares,
      makeMove,
      setNavFen,
      setNavIndex
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto scroll down when new message is added
  useEffect(() => {
    const chatList = chatListRef.current;
    if (!chatList) return;
    chatList.scrollTop = chatList.scrollHeight;
  }, [chatMessages]);

  // auto scroll for moves
  useEffect(() => {
    const activeMoveEl = document.getElementById("activeNavMove");
    const moveList = moveListRef.current;
    if (!activeMoveEl || !moveList) return;
    moveList.scrollTop = activeMoveEl.offsetTop;
  });

  useEffect(() => {
    updateTurnTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobby]);
  useEffect(() => {
    if (lobby.winner) {
      const payload = { key: lobby.winner, value: lobby.pgn };
      const options = {
        method: "POST",
        url: "http://localhost:3001/v1/gun/store",
        headers: {
          "Content-Type": "application/json"
        },
        body: `${payload}`
      };
      fetch("http://localhost:3001/v1/gun/store", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    }
  }, [lobby.winner]);

  function updateTurnTitle() {
    if (lobby.side === "s" || !lobby.white?.id || !lobby.black?.id) return;

    if (lobby.side === lobby.actualGame.turn()) {
      document.title = "(your turn) kchess";
    } else {
      document.title = "kchess";
    }
  }

  function handleResize() {
    if (window.innerWidth >= 1920) {
      setBoardWidth(580);
    } else if (window.innerWidth >= 1536) {
      setBoardWidth(540);
    } else if (window.innerWidth >= 768) {
      setBoardWidth(480);
    } else {
      setBoardWidth(350);
    }
  }

  function addMessage(message: Message) {
    setChatMessages((prev) => [...prev, message]);
  }

  function sendChat(message: string) {
    if (!session?.user) return;

    socket.emit("chat", message);
    addMessage({ author: session.user, message });
  }

  function chatKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      if (!input.value || input.value.length == 0) return;
      sendChat(input.value);
      input.value = "";
    }
  }

  function chatClickSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("chatInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) return;
    sendChat(input.value);
    input.value = "";
  }

  function makeMove(m: { from: string; to: string; promotion?: string }) {
    try {
      const result = lobby.actualGame.move(m);

      if (result) {
        setNavFen(null);
        setNavIndex(null);
        updateLobby({
          type: "updateLobby",
          payload: { pgn: lobby.actualGame.pgn() }
        });
        updateTurnTitle();
        let kingSquare = undefined;
        if (lobby.actualGame.inCheck()) {
          const kingPos = lobby.actualGame.board().reduce((acc, row, index) => {
            const squareIndex = row.findIndex(
              (square) => square && square.type === "k" && square.color === lobby.actualGame.turn()
            );
            return squareIndex >= 0 ? `${String.fromCharCode(squareIndex + 97)}${8 - index}` : acc;
          }, "");
          kingSquare = {
            [kingPos]: {
              background: "radial-gradient(red, rgba(255,0,0,.4), transparent 70%)",
              borderRadius: "50%"
            }
          };
        }
        updateCustomSquares({
          lastMove: {
            [result.from]: { background: "rgba(255, 255, 0, 0.4)" },
            [result.to]: { background: "rgba(255, 255, 0, 0.4)" }
          },
          options: {},
          check: kingSquare
        });
        return true;
      } else {
        throw new Error("Invalid move");
      }
    } catch (err) {
      updateCustomSquares({
        options: {}
      });
      return false;
    }
  }

  function isDraggablePiece({ piece }: { piece: string }) {
    return piece.startsWith(lobby.side);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (lobby.side === "s" || navFen) return false;

    // premove
    if (lobby.side !== lobby.actualGame.turn()) return true;

    const moveDetails = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) return false; // illegal move
    socket.emit("sendMove", moveDetails);
    return true;
  }

  function getMoveOptions(square: Square) {
    const moves = lobby.actualGame.moves({
      square,
      verbose: true
    }) as Move[];
    if (moves.length === 0) {
      return;
    }

    const newSquares: {
      [square: string]: { background: string; borderRadius?: string };
    } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          lobby.actualGame.get(move.to as Square) &&
          lobby.actualGame.get(move.to as Square)?.color !== lobby.actualGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    updateCustomSquares({ options: newSquares });
  }

  function onPieceDragBegin(_piece: string, sourceSquare: Square) {
    if (lobby.side !== lobby.actualGame.turn() || navFen) return;

    getMoveOptions(sourceSquare);
  }

  function onPieceDragEnd() {
    updateCustomSquares({ options: {} });
  }

  function onSquareClick(square: Square) {
    updateCustomSquares({ rightClicked: {} });
    if (lobby.side !== lobby.actualGame.turn() || navFen) return;

    function resetFirstMove(square: Square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (moveFrom === null) {
      resetFirstMove(square);
      return;
    }

    const moveDetails = {
      from: moveFrom,
      to: square,
      promotion: "q"
    };

    const move = makeMove(moveDetails);
    if (!move) {
      resetFirstMove(square);
    } else {
      setMoveFrom(null);
      socket.emit("sendMove", moveDetails);
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    updateCustomSquares({
      rightClicked: {
        ...customSquares.rightClicked,
        [square]:
          customSquares.rightClicked[square] &&
          customSquares.rightClicked[square]?.backgroundColor === colour
            ? undefined
            : { backgroundColor: colour }
      }
    });
  }

  function clickPlay(e: FormEvent<HTMLButtonElement>) {
    setPlayBtnLoading(true);
    e.preventDefault();
    socket.emit("joinAsPlayer");
  }

  function getPlayerHtml(side: "top" | "bottom") {
    const blackHtml = (
      <div className="flex w-full flex-col justify-center">
        <span className={lobby.black?.name ? "font-bold" : ""}>
          {lobby.black?.name || "(no one)"}
        </span>
        <span className="flex items-center gap-1 text-xs">
          black
          {lobby.black?.connected === false && (
            <span className="badge badge-xs badge-error">disconnected</span>
          )}
        </span>
      </div>
    );
    const whiteHtml = (
      <div className="flex w-full flex-col justify-center">
        <span className={lobby.white?.name ? "font-bold" : ""}>
          {lobby.white?.name || "(no one)"}
        </span>
        <span className="flex items-center gap-1 text-xs">
          white
          {lobby.white?.connected === false && (
            <span className="badge badge-xs badge-error">disconnected</span>
          )}
        </span>
      </div>
    );

    if (lobby.black?.id === session?.user?.id) {
      return side === "top" ? whiteHtml : blackHtml;
    } else {
      return side === "top" ? blackHtml : whiteHtml;
    }
  }

  function copyInvite() {
    const text = `http://localhost:3000/${initialLobby.code}`;
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 5000);
  }

  function getMoveListHtml() {
    const history = lobby.actualGame.history({ verbose: true });

    const movePairs = history
      .slice(history.length / 2)
      .map((_, i) => history.slice((i *= 2), i + 2));

    return movePairs.map((moves, i) => {
      return (
        <tr className="flex w-full items-center space-x-[2em] space-y-2" key={i + 1}>
          <td className="">{i + 1}.</td>
          <td
            className={
              "btn btn-ghost btn-xs h-full w-2/5 !bg-white font-normal normal-case !text-black" +
              ((history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? " pointer-events-none rounded-none border-[2px] border-gray-900"
                : "")
            }
            id={
              (history.indexOf(moves[0]) === history.length - 1 && navIndex === null) ||
              navIndex === history.indexOf(moves[0])
                ? "activeNavMove"
                : ""
            }
            onClick={() => navigateMove(history.indexOf(moves[0]))}
          >
            {moves[0].san}
          </td>
          {moves[1] && (
            <td
              className={
                "btn btn-ghost btn-xs h-full w-2/5 !bg-black font-normal normal-case !text-white" +
                ((history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? " pointer-events-none rounded-none border-[2px] border-white"
                  : "")
              }
              id={
                (history.indexOf(moves[1]) === history.length - 1 && navIndex === null) ||
                navIndex === history.indexOf(moves[1])
                  ? "activeNavMove"
                  : ""
              }
              onClick={() => navigateMove(history.indexOf(moves[1]))}
            >
              {moves[1].san}
            </td>
          )}
        </tr>
      );
    });
  }

  function navigateMove(index: number | null | "prev") {
    const history = lobby.actualGame.history({ verbose: true });

    if (index === null || index >= history.length - 1 || !history.length) {
      // last move
      setNavIndex(null);
      setNavFen(null);
      return;
    }

    if (index === "prev") {
      index = history.length - 2;
    } else if (index < 0) {
      index = 0;
    }

    chessboardRef.current?.clearPremoves(false);

    setNavIndex(index);
    setNavFen(history[index + 1].fen);
  }

  function getNavMoveSquares() {
    if (navIndex === null) return;
    const history = lobby.actualGame.history({ verbose: true });

    if (!history.length) return;

    return {
      [history[navIndex].from]: { background: "rgba(255, 255, 0, 0.4)" },
      [history[navIndex].to]: { background: "rgba(255, 255, 0, 0.4)" }
    };
  }

  return (
    <div
      className="flex h-auto w-screen flex-wrap justify-center gap-6 px-4 py-4 lg:gap-10 2xl:gap-16"
      style={{
        backgroundImage:
          " linear-gradient(to right top, rgba(22, 10, 75, 0.7), rgba(4, 4, 24, 0.8), rgba(63, 9, 78, 0.7))"
      }}
    >
      <div className="hidden h-full w-[25em] rounded-md shadow-sm lg:inline-block">
        <div className="flex h-[50%] w-full flex-col items-center justify-center gap-[2em] bg-[#212020]">
          <span className="flex h-[10em] w-[10em] items-center justify-center rounded-full bg-white">
            <img
              src="https://www.kindpng.com/picc/m/22-223299_white-knight-chess-png-transparent-png.png"
              alt="profile_pic"
              className="h-[8em] w-[8em] rounded-full object-cover"
            />
          </span>

          <h2 className="text-2xl font-medium">
            {lobby?.white?.name ? lobby?.white?.name : "Anonymous"}
          </h2>
          <span className="flex items-center gap-1 text-xs">
            {lobby.white?.connected === false && (
              <span className="badge badge-xs badge-error">disconnected</span>
            )}
          </span>
        </div>
        <div className="flex h-[50%] w-full flex-col items-center justify-center gap-[2em] bg-[#141514]">
          <span className="rounded-full bg-white">
            <img
              src="https://www.clipartmax.com/png/middle/48-485025_tile-black-symbol-king-queen-white-cartoon-chess-black-king-chess-png.png"
              alt="profile_pic"
              className="h-[10em] w-[10em] rounded-full object-cover"
            />
          </span>
          <h2 className="text-2xl font-medium">
            {lobby?.black?.name ? lobby?.black?.name : "Anonymous"}
          </h2>
          <span className="flex items-center gap-1 text-xs">
            {lobby.black?.connected === false && (
              <span className="badge badge-xs badge-error">disconnected</span>
            )}
          </span>
        </div>
      </div>
      <div className="relative h-min">
        {/* overlay */}
        {(!lobby.white?.id || !lobby.black?.id) && (
          <div className="absolute top-0 right-0 bottom-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-70">
            <div className="bg-base-200 flex w-full items-center justify-center gap-4 py-4 px-2">
              Waiting for opponent.
              {session?.user?.id !== lobby.white?.id && session?.user?.id !== lobby.black?.id && (
                <button
                  className={"btn btn-secondary" + (playBtnLoading ? " btn-disabled" : "")}
                  onClick={clickPlay}
                >
                  Play as {lobby.white?.id ? "black" : "white"}
                </button>
              )}
            </div>
          </div>
        )}

        <Chessboard
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: "#41626D" }}
          // customDarkSquareStyle={{ backgroundColor: "#4b7399" }}
          customLightSquareStyle={{ backgroundColor: "#91A0A8" }}
          // customLightSquareStyle={{ backgroundColor: "#eae9d2" }}
          position={navFen || lobby.actualGame.fen()}
          boardOrientation={lobby.side === "b" ? "black" : "white"}
          isDraggablePiece={isDraggablePiece}
          onPieceDragBegin={onPieceDragBegin}
          onPieceDragEnd={onPieceDragEnd}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          arePremovesAllowed={!navFen}
          customSquareStyles={{
            ...(navIndex === null ? customSquares.lastMove : getNavMoveSquares()),
            ...(navIndex === null ? customSquares.check : {}),
            ...customSquares.rightClicked,
            ...(navIndex === null ? customSquares.options : {})
          }}
          ref={chessboardRef}
        />
      </div>
      {/* <div className="flex flex-1 flex-col items-center justify-between md:hidden">
        {getPlayerHtml("top")}
        <div className="my-auto w-full text-sm">vs</div>
        {getPlayerHtml("bottom")}
      </div> */}

      <div className="flex max-w-lg flex-1 flex-col items-center justify-center gap-4 bg-[#141514]">
        <div className="mb-auto flex w-full p-2">
          {/* <div className="flex flex-1 flex-col items-center justify-between">
            {getPlayerHtml("top")}
            <div className="my-auto w-full text-sm">vs</div>
            {getPlayerHtml("bottom")}
          </div> */}

          <div className="flex flex-1 flex-col gap-1">
            <div className="mb-2 flex w-full flex-col items-end gap-1">
              <p>Invite friends:</p>
              <label
                tabIndex={0}
                className="badge badge-md bg-base-300 text-base-content h-8 cursor-pointer gap-1 font-mono  text-xs sm:h-5 sm:text-sm"
                onClick={copyInvite}
              >
                <IconCopy size={16} />
                kchess/{initialLobby.code}
              </label>

              {copiedLink && (
                <div tabIndex={0} className="dropdown-content badge badge-neutral text-xs shadow">
                  copied to clipboard
                </div>
              )}
            </div>
            <div className="h-[20em] w-full overflow-y-scroll" ref={moveListRef}>
              <table className="table-compact table w-full">
                <tbody>{getMoveListHtml()}</tbody>
              </table>
            </div>
            <div className="flex h-4 w-full">
              <button
                className={
                  "btn btn-sm flex-grow rounded-r-none" +
                  (navIndex === 0 || lobby.actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(0)}
              >
                <IconPlayerSkipBack size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-none" +
                  (navIndex === 0 || lobby.actualGame.history().length <= 1 ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? "prev" : navIndex - 1)}
              >
                <IconChevronLeft size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-none" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(navIndex === null ? null : navIndex + 1)}
              >
                <IconChevronRight size={18} />
              </button>
              <button
                className={
                  "btn btn-sm flex-grow rounded-l-none" + (navIndex === null ? " btn-disabled" : "")
                }
                onClick={() => navigateMove(null)}
              >
                <IconPlayerSkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-[25em] w-full min-w-fit">
          <div className="flex h-full w-full min-w-[64px] flex-col rounded-lg bg-gray-800 p-4 shadow-sm">
            <ul
              className="mb-4 flex h-full flex-col gap-2 overflow-y-scroll break-words"
              ref={chatListRef}
            >
              {chatMessages.map((m, i) => (
                <li
                  className={
                    "max-w-[30rem] " +
                    (!m.author.id && m.author.name === "server" ? "bg-white p-2 text-black" : "")
                  }
                  key={i}
                >
                  <span>
                    {m.author.id && (
                      <span>
                        <span className="font-bold">{m.author.name}</span>:{" "}
                      </span>
                    )}
                    <span className={`${!m.author.id ? "mb-3 font-bold" : "rounded-md"} `}>
                      {m.message}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <form className="input-group mt-auto" onSubmit={chatClickSend}>
              <input
                type="text"
                placeholder="Chat here..."
                className="input input-bordered flex-grow"
                name="chatInput"
                id="chatInput"
                onKeyUp={chatKeyUp}
                required
              />
              <button className="btn btn-secondary ml-1" type="submit">
                send
              </button>
            </form>
          </div>
        </div>
        {lobby.observers && lobby.observers.length > 0 && (
          <div className="w-full px-2 text-xs md:px-0">
            Spectators: {lobby.observers?.map((o) => o.name).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
