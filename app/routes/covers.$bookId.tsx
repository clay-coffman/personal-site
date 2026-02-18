import { readFileSync } from "fs";
import type { LoaderFunctionArgs } from "react-router";
import { getCoverPath } from "~/lib/calibre.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const bookId = Number(params.bookId);
  if (isNaN(bookId)) {
    throw new Response("Not found", { status: 404 });
  }

  const coverPath = getCoverPath(bookId);
  if (!coverPath) {
    throw new Response("Not found", { status: 404 });
  }

  const file = readFileSync(coverPath);
  return new Response(file, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
