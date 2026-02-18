import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { PageLayout } from "~/components/page-layout";
import { BookGrid } from "~/components/book-grid";
import { getFavoriteBooks } from "~/lib/calibre.server";

export const meta: MetaFunction = () => {
  return [{ title: "Clay Coffman - Bookshelf" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const books = getFavoriteBooks();
  return { books };
}

export default function Books() {
  const { books } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="py-12">
        <div className="mb-8">
          <h1 className="text-h2 mb-3">Bookshelf</h1>
          <p className="text-muted">
            These are books that I either enjoyed enough to want to read them
            again, or had a profound impact on my life (or both, in some cases).
          </p>
          <p className="text-muted">
            <em>
              Technically, they are books I've rated 5-stars in Calibre, which I
              also host on this server.
            </em>
          </p>
        </div>
        <BookGrid books={books} />
      </div>
    </PageLayout>
  );
}
