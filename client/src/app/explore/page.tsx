import PublicGames from "@/components/home/PublicGames/PublicGames";

const page = () => {
  return (
    <div className="flex w-full -translate-y-10 flex-wrap items-center justify-center gap-8 px-4 py-10 lg:gap-16 ">
      {/* @ts-expect-error Server Component */}
      <PublicGames />
    </div>
  );
};

export default page;
