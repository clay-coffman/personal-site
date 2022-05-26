import Link from "next/link";
import Intro from "@/components/intro";

export default function Header() {
  return (
    <div>
      <Intro />
      <h2 className="text-accent-2 text-xl md:text-3xl font-title font-bold italic space-x-3 leading-tight mb-10">
        <Link href="/">
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
        <Link href="/about/">
          <a className="hover:underline">About</a>
        </Link>
      </h2>
    </div>
  );
}
