import JoinGame from "@/components/home/JoinGame";
import CreateGame from "@/components/home/CreateGame";

const play = () => {
  return (
    <div
      className="flex h-[89vh] w-screen flex-wrap items-center justify-center gap-8 px-4 py-10 lg:gap-16 "
      style={{
        backgroundImage:
          " linear-gradient(to right top, rgba(22, 10, 75, 0.7), rgba(4, 4, 24, 0.8), rgba(63, 9, 78, 0.7))"
      }}
    >
      <div className="flex -translate-y-5 flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold leading-tight">Join from invite</h2>
          <JoinGame />
        </div>

        <div className="divider divider-vertical -translate-y-5">or</div>

        <div className="flex -translate-y-5 flex-col items-center">
          <h2 className="mb-4 text-xl font-bold leading-tight">Create game</h2>
          <CreateGame />
        </div>
      </div>
    </div>
  );
};

export default play;
