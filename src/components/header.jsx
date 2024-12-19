import Link from "next/link";
import Intro from "@/components/intro";

export default function Header() {
  return (
    <div>
      <Intro />
      <h2 className="text-accent-2 text-xl md:text-4xl text-center md:text-left font-title font-bold italic md:space-x-3 space-x-2 mb-8">
        <Link href="/" legacyBehavior={false} className="hover:underline">
          About
        </Link>
        <Link href="/books" legacyBehavior={false} className="hover:underline">
          Bookshelf
        </Link>
        <a
          href="https://claymcoffman.myportfolio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Photos
        </a>
      </h2>
    </div>
  );
}
