import BoardManager from "./components/BoardManager";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col justify-between py-16 px-4 md:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <BoardManager />
      </div>
    </main>
  );
}
