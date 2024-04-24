import Link from "next/link";
import Intro from "@/components/intro";

export default function Header() {
  return (
    <div>
      <Intro />
      <h2 className="text-accent-2 text-xl md:text-4xl text-center md:text-left font-title font-bold italic md:space-x-3 space-x-2 mb-8">
        <Link href="/" className="hover:underline">
          About
        </Link>
        <Link href="/books/" className="hover:underline">
          Bookshelf
        </Link>
        <Link href="/photos/" className="hover:underline">
          Photos
        </Link>
        <Link href="/stuff/" className="hover:underline">
          Stuff
        </Link>
      </h2>
    </div>
  );
}
