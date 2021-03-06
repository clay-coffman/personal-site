import Link from "next/link";
import Intro from "@/components/intro";

export default function Header() {
  return (
    <div>
      <Intro />
      <h2 className="text-accent-2 text-xl md:text-4xl text-center md:text-left font-title font-bold italic md:space-x-3 space-x-2 mb-8">
        <Link href="/">
          <a className="hover:underline">About</a>
        </Link>
        <Link href="/writing/">
          <a className="hover:underline">Writing</a>
        </Link>
        <Link href="/books/">
          <a className="hover:underline">Books</a>
        </Link>
        <Link href="/photos/">
          <a className="hover:underline">Photos</a>
        </Link>
        <Link href="/nfts/">
          <a className="hover:underline">NFTs</a>
        </Link>
      </h2>
    </div>
  );
}
