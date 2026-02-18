import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { desc, eq } from "drizzle-orm";
import { getDb } from "~/lib/db.server";
import { books } from "~/db/schema";
import { setFlashMessage } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const db = getDb();
  const allBooks = db.select().from(books).orderBy(desc(books.createdAt)).all();
  return { books: allBooks };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const db = getDb();

  if (intent === "addBook") {
    const title = String(formData.get("title") || "");
    const author = String(formData.get("author") || "");
    const rating = formData.get("rating")
      ? Number(formData.get("rating"))
      : null;
    const dateCompleted = String(formData.get("dateCompleted") || "") || null;
    const coverImage = String(formData.get("coverImage") || "") || null;

    if (!title || !author) {
      return { error: "Title and author are required" };
    }

    db.insert(books)
      .values({ title, author, rating, dateCompleted, coverImage })
      .run();

    const { headers } = await setFlashMessage(request, {
      type: "success",
      text: `Book "${title}" has been added!`,
    });
    return redirect("/admin/books", { headers });
  }

  if (intent === "updateRating") {
    const bookId = Number(formData.get("bookId"));
    const newRating = formData.get("rating")
      ? Number(formData.get("rating"))
      : null;

    db.update(books)
      .set({ rating: newRating })
      .where(eq(books.id, bookId))
      .run();

    const { headers } = await setFlashMessage(request, {
      type: "success",
      text: "Rating updated!",
    });
    return redirect("/admin/books", { headers });
  }

  if (intent === "deleteBook") {
    const bookId = Number(formData.get("bookId"));
    db.delete(books).where(eq(books.id, bookId)).run();

    const { headers } = await setFlashMessage(request, {
      type: "info",
      text: "Book deleted.",
    });
    return redirect("/admin/books", { headers });
  }

  return null;
}
