import Link from "next/link";

export default function Header() {
  return (
    <h2 className="text-xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/">
        <a className="hover:underline">Blog</a>
      </Link>{" "}
      <Link href="/books/">
        <a className="hover:underline">Books</a>
      </Link>
      .
    </h2>
  );
}
