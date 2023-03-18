import Link from "next/link";

export default function Home() {
  return (
    <div className="mainBox">
      <div className="box12">
        <Link href="/play">
          <div className="box1 h-0 transition-all duration-300 ease-in-out hover:scale-105">
            <h2>Play</h2>
            <small>Let&apos;s play</small>
          </div>
        </Link>
        <Link href="/explore">
          <div className="box2 transition-all duration-300 ease-in-out hover:scale-105">
            <h2>Chess World</h2>
            <small>Explore</small>
          </div>
        </Link>
      </div>

      <div className="boxcontainer">
        <div className="box3">
          <a href="chess.com/lessons" target="_blank">
            <div className="box31 transition-all duration-300 ease-in-out hover:scale-105">
              <h2>Learn</h2>
              <small>Learn more</small>
            </div>
          </a>
          <div className="box32 transition-all duration-300 ease-in-out hover:scale-105">
            <h2>About</h2>
            <small>About us</small>
          </div>
        </div>
        <div className="box33 transition-all duration-300 ease-in-out hover:scale-105">
          <h2>Coming Soon</h2>
          <small>upcoming feature</small>
        </div>
      </div>
    </div>
  );
}

// <div className="flex w-full flex-wrap items-center justify-center gap-8 px-4 py-10 lg:gap-16 ">
//       {/* @ts-expect-error Server Component */}
//       <PublicGames />

//       <div className="flex flex-col items-center gap-4">
//         <div className="flex flex-col items-center">
//           <h2 className="mb-4 text-xl font-bold leading-tight">Join from invite</h2>
//           <JoinGame />
//         </div>

//         <div className="divider divider-vertical">or</div>

//         <div className="flex flex-col items-center">
//           <h2 className="mb-4 text-xl font-bold leading-tight">Create game</h2>
//           <CreateGame />
//         </div>
//       </div>
//     </div>
