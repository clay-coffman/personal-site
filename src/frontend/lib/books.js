const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

export async function getBooks(sort = "title") {
  try {
    const sortQuery = sort === "rating" ? "-rating" : "title";

    const response = await fetch(
      `${PAYLOAD_URL}/api/books?sort=${sortQuery}&limit=100`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(PAYLOAD_SECRET && { Authorization: `Bearer ${PAYLOAD_SECRET}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.docs.map((book) => {
      return {
        id: book.id,
        fields: {
          Title: book.title,
          Author: book.author,
          Rating: book.rating,
          "Cover Image": book.coverImage?.url ? book.coverImage.url : null,
        },
      };
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
