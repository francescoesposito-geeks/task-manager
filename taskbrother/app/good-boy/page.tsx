import Link from "next/link";

export default function GoodBoyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl font-bold">Good boy</h1>
        <p>scemoooo</p>
        <Link
          href="/"
          className="mt-6 px-5 py-2.5 bg-black hover:bg-blue-700 text-white font-medium rounded-xl text-center"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
