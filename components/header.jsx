import Link from "next/link";

export default function Header() {
  return (
    <h2 className="text-accent-2 text-xl md:text-3xl font-bold tracking-tight md:tracking-tighter space-x-3 leading-tight mb-20 mt-8">
      <Link href="/">
        <a className="hover:underline">Blog</a>
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
  );
}
