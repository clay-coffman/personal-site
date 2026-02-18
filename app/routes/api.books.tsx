import type { LoaderFunctionArgs } from "react-router";
import { desc, asc, isNotNull } from "drizzle-orm";
import { getDb } from "~/lib/db.server";
import { books } from "~/db/schema";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") || "rating";
  const db = getDb();

  let result;
  if (sort === "date") {
    result = db
      .select()
      .from(books)
      .where(isNotNull(books.dateCompleted))
      .orderBy(desc(books.dateCompleted))
      .all();
  } else if (sort === "title") {
    result = db.select().from(books).orderBy(asc(books.title)).all();
  } else {
    result = db
      .select()
      .from(books)
      .where(isNotNull(books.rating))
      .orderBy(desc(books.rating), desc(books.dateCompleted))
      .all();
  }

  return Response.json(result);
}
