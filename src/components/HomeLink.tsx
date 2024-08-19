"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeLink() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Link href="/">
      <div className="mt-6 text-center">
        <p
          className={`text-3xl font-bold transition-all duration-500 ${
            loaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          Options Pricing Calculator
        </p>
        <p className="italic text-gray-400">
          Click here to return to the home page.
        </p>
      </div>
    </Link>
  );
}
