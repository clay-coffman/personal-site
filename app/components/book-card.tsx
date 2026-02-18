import { Badge } from "~/components/ui/badge";
import type { CalibreBook } from "~/lib/calibre.server";

export function BookCard({ book }: { book: CalibreBook }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      {book.hasCover ? (
        <img
          src={`/covers/${book.id}`}
          alt={book.title}
          className="h-[280px] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-[280px] items-center justify-center bg-background-alt">
          <span className="text-muted/50">No Cover</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="mb-1 text-body-sm font-semibold leading-tight text-foreground">
          {book.title}
        </h3>
        <p className="mb-2 text-body-2xs text-muted">{book.author}</p>
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
