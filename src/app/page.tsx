import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex justify-center mt-12 flex-col items-center gap-12">
        <Link href="/black-scholes">
          <div className="w-[400px] shadow-xl bg-black text-white border-black border-2 p-10 rounded-xl transition-all duration-500 hover:bg-white hover:text-black hover:-translate-y-4">
            <p className="text-xl text-center">Black-Scholes Model</p>
          </div>
        </Link>
        <Link href="/monte-carlo">
          <div className="w-[400px] shadow-xl bg-black text-white border-black border-2 p-10 rounded-xl transition-all duration-500 hover:bg-white hover:text-black hover:-translate-y-4">
            <p className="text-xl text-center">Monte Carlo Simulation</p>
          </div>
        </Link>
      </div>
    </>
  );
}
