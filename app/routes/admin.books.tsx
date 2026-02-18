import { Form, Link, useLoaderData, useActionData } from "react-router";
import type { MetaFunction } from "react-router";
import type { Book } from "~/db/schema";
import { Card, CardHeader, CardBody } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Icon } from "~/components/ui/icon";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "~/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";

export const meta: MetaFunction = () => {
  return [{ title: "Admin - Manage Books" }];
};

export { loader, action } from "~/lib/admin-books.server";

export default function AdminBooks() {
  const { books: bookList } = useLoaderData() as { books: Book[] };
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-h2">Manage Books</h1>
        <Link to="/admin/logout">
          <Button variant="secondary" size="sm">
            <Icon name="sign-out" size={14} className="mr-2" /> Sign Out
          </Button>
        </Link>
      </div>

      {actionData?.error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-body-sm text-red-800">
          {actionData.error}
        </div>
      )}

      {/* Add Book Form */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-h3-sm m-0">Add New Book</h2>
        </CardHeader>
        <CardBody>
          <Form method="post">
            <input type="hidden" name="intent" value="addBook" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title" className="mb-1.5 block">
                  Title *
                </Label>
                <Input type="text" id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="author" className="mb-1.5 block">
                  Author *
                </Label>
                <Input type="text" id="author" name="author" required />
              </div>
              <div>
                <Label htmlFor="rating" className="mb-1.5 block">
                  Rating
                </Label>
                <Select id="rating" name="rating" className="w-full">
                  <option value="">No rating</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateCompleted" className="mb-1.5 block">
                  Date Completed
                </Label>
                <Input type="date" id="dateCompleted" name="dateCompleted" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="coverImage" className="mb-1.5 block">
                  Cover Image URL
                </Label>
                <Input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit">
                  <Icon name="plus" size={14} className="mr-2" /> Add Book
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>

      {/* Books List */}
      <Card>
        <CardHeader>
          <h2 className="text-h3-sm m-0">
            Current Books ({bookList.length})
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          {bookList.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Author</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader>Date Completed</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookList.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      {book.title}
                      {book.currentlyReading && (
                        <span className="ml-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[0.7rem] text-white">
                          Reading
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Form method="post" className="inline">
                        <input
                          type="hidden"
                          name="intent"
                          value="updateRating"
                        />
                        <input type="hidden" name="bookId" value={book.id} />
                        <Select
                          name="rating"
                          defaultValue={book.rating?.toString() || ""}
                          onChange={(e) =>
                            (e.target as HTMLSelectElement).form?.submit()
                          }
                          className="w-auto"
                        >
                          <option value="">-</option>
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {"★".repeat(r)}
                            </option>
                          ))}
                        </Select>
                      </Form>
                    </TableCell>
                    <TableCell>{book.dateCompleted || "-"}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="danger" size="sm">
                            <Icon name="trash" size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Delete Book</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete &ldquo;{book.title}
                            &rdquo;? This action cannot be undone.
                          </DialogDescription>
                          <div className="mt-4 flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Form method="post">
                              <input
                                type="hidden"
                                name="intent"
                                value="deleteBook"
                              />
                              <input
                                type="hidden"
                                name="bookId"
                                value={book.id}
                              />
                              <Button type="submit" variant="danger">
                                Delete
                              </Button>
                            </Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="px-6 py-8 text-center text-muted">
              No books added yet.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
