/**
 * Hardcover GraphQL client + helpers for search, library, and list management.
 *
 * Reads HARDCOVER_API_KEY from env. All queries hit the public GraphQL endpoint
 * at https://api.hardcover.app/v1/graphql. The schema is Hasura-backed over
 * Postgres with a few custom functions (`search`) and mutations
 * (`insert_user_book`, `insert_list_book`, ...).
 */

const ENDPOINT = "https://api.hardcover.app/v1/graphql";
const USER_AGENT = "about-clay-sync/1.0";

const SUMMARY_TITLE_RE =
  /\b(key takeaways|summary of|summary:|analysis of|study guide|cliffs.?notes|sparknotes|reader.?companion)\b/i;

function requireToken() {
  const t = process.env.HARDCOVER_API_KEY;
  if (!t) throw new Error("HARDCOVER_API_KEY is not set");
  return t;
}

const MAX_429_RETRIES = 6;
const MIN_CALL_INTERVAL_MS = parseInt(
  process.env.HARDCOVER_MIN_INTERVAL_MS || "1100",
  10,
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let _lastCallAt = 0;
async function throttle() {
  const now = Date.now();
  const waitMs = _lastCallAt + MIN_CALL_INTERVAL_MS - now;
  if (waitMs > 0) await sleep(waitMs);
  _lastCallAt = Date.now();
}

export async function gql(query, variables) {
  const token = requireToken();
  for (let attempt = 0; ; attempt++) {
    await throttle();
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (res.status === 429 && attempt < MAX_429_RETRIES) {
      const retryAfter = parseFloat(res.headers.get("retry-after") || "") || 0;
      const waitMs = Math.max(retryAfter * 1000, 2000 * Math.pow(2, attempt));
      console.warn(
        `  hardcover 429 (attempt ${attempt + 1}/${MAX_429_RETRIES}), sleeping ${Math.round(waitMs / 1000)}s`,
      );
      await sleep(waitMs);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`hardcover http ${res.status}: ${body.slice(0, 500)}`);
    }
    const body = await res.json();
    if (body.errors) {
      throw new Error(
        `hardcover graphql: ${JSON.stringify(body.errors).slice(0, 800)}`,
      );
    }
    return body.data;
  }
}

let _cachedMe = null;
export async function me() {
  if (_cachedMe) return _cachedMe;
  const data = await gql(`query { me { id username } }`);
  _cachedMe = data.me[0];
  return _cachedMe;
}

/**
 * Find the user-owned list matching a given slug.
 * Every account has an auto-created "Owned" list; users can create more.
 */
export async function findUserList(slug) {
  const { id: userId } = await me();
  const data = await gql(
    `query($uid: Int!, $slug: String!) {
      lists(where: {user_id: {_eq: $uid}, slug: {_eq: $slug}}, limit: 1) {
        id name slug books_count
      }
    }`,
    { uid: userId, slug },
  );
  return data.lists[0] || null;
}

/**
 * Search books by free-text query. Fetches a wider candidate pool than the
 * caller needs (Hardcover's relevance ranking sometimes surfaces commentary
 * and study-guide editions above the canonical book) and returns them
 * re-scored and sorted, labeled by confidence.
 */
export async function searchBooks({ title, author, isbn, limit = 5 }) {
  if (isbn) {
    const hit = await findBookByIsbn(isbn);
    if (hit) return [{ ...hit, confidence: "high", via: "isbn" }];
  }

  const query = [title, author].filter(Boolean).join(" ");
  if (!query) return [];

  const candidatePool = Math.max(25, limit * 5);
  const data = await gql(
    `query($q: String!, $per: Int!) {
      search(query: $q, query_type: "books", per_page: $per) { results }
    }`,
    { q: query, per: candidatePool },
  );

  const hits = data.search?.results?.hits || [];
  return hits
    .map((h) => {
      const doc = h.document;
      const scored = scoreHit(doc, { title, author });
      return {
        id: parseInt(doc.id, 10),
        title: doc.title,
        slug: doc.slug,
        authors: doc.author_names || [],
        isbns: doc.isbns || [],
        releaseYear: doc.release_year,
        genres: doc.genres || [],
        imageUrl: doc.image?.url || null,
        usersCount: doc.users_count || 0,
        confidence: scored.confidence,
        score: scored.score,
        via: "search",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Convenience wrapper: return the single best match for a book, or null if
 * nothing confidently matches.
 */
export async function findBestMatch(input) {
  const candidates = await searchBooks(input);
  return candidates[0] || null;
}

export async function findBookByIsbn(isbn) {
  const normalized = String(isbn).replace(/[^0-9Xx]/g, "");
  if (normalized.length !== 10 && normalized.length !== 13) return null;
  const field = normalized.length === 13 ? "isbn_13" : "isbn_10";

  const data = await gql(
    `query($v: String!) {
      editions(where: {${field}: {_eq: $v}}, limit: 1) {
        id
        isbn_10
        isbn_13
        book {
          id
          title
          slug
          release_year
          cached_image
          cached_tags
          cached_contributors
        }
      }
    }`,
    { v: normalized },
  );

  const edition = data.editions[0];
  if (!edition) return null;
  const book = edition.book;
  return {
    id: book.id,
    editionId: edition.id,
    title: book.title,
    slug: book.slug,
    authors: extractAuthors(book.cached_contributors),
    isbns: [edition.isbn_10, edition.isbn_13].filter(Boolean),
    releaseYear: book.release_year,
    genres: extractGenres(book.cached_tags),
    imageUrl: book.cached_image?.url || null,
    usersCount: 0,
    score: 100,
  };
}

/**
 * Check whether the current user already has this book in their library.
 * Returns the user_book id if present, null otherwise.
 */
export async function findExistingUserBook(bookId) {
  const { id: userId } = await me();
  const data = await gql(
    `query($uid: Int!, $bid: Int!) {
      user_books(where: {user_id: {_eq: $uid}, book_id: {_eq: $bid}}, limit: 1) {
        id book_id edition_id status_id
      }
    }`,
    { uid: userId, bid: bookId },
  );
  return data.user_books[0] || null;
}

/**
 * Add a book to the current user's library. Idempotent: returns the existing
 * user_book if already present.
 */
export async function addToLibrary({ bookId, editionId = null, statusId = null }) {
  const existing = await findExistingUserBook(bookId);
  if (existing) return { id: existing.id, created: false };

  const object = { book_id: bookId };
  if (editionId) object.edition_id = editionId;
  if (statusId) object.status_id = statusId;

  const data = await gql(
    `mutation($obj: UserBookCreateInput!) {
      insert_user_book(object: $obj) {
        id
        user_book { id book_id status_id }
        error
      }
    }`,
    { obj: object },
  );
  const result = data.insert_user_book;
  if (result.error) throw new Error(`insert_user_book: ${result.error}`);
  return { id: result.user_book.id, created: true };
}

/**
 * Add a book to a named list, identified by list_id. Idempotent: checks
 * membership first.
 */
export async function addToList({ bookId, listId, editionId = null }) {
  const existing = await gql(
    `query($lid: Int!, $bid: Int!) {
      list_books(where: {list_id: {_eq: $lid}, book_id: {_eq: $bid}}, limit: 1) {
        id
      }
    }`,
    { lid: listId, bid: bookId },
  );
  if (existing.list_books[0]) {
    return { id: existing.list_books[0].id, created: false };
  }

  const object = { book_id: bookId, list_id: listId };
  if (editionId) object.edition_id = editionId;

  const data = await gql(
    `mutation($obj: ListBookInput!) {
      insert_list_book(object: $obj) {
        id
        list_book { id book_id list_id }
      }
    }`,
    { obj: object },
  );
  const result = data.insert_list_book;
  if (!result.list_book) {
    throw new Error(`insert_list_book failed: ${JSON.stringify(result)}`);
  }
  return { id: result.list_book.id, created: true };
}

/**
 * Fetch all books in a list, ordered by position. Returns a projection
 * compatible with the site's Book interface (id/title/author/tags/hasCover).
 *
 * For covers, pulls the book-level `image` plus all English editions with
 * images, then picks the largest (by area). The book-level `cached_image` is
 * often a low-res thumbnail imported from a third-party feed (~98×142), while
 * editions frequently carry 300×500+ covers uploaded to Hardcover's own CDN.
 */
export async function getList({ listId }) {
  const data = await gql(
    `query($lid: Int!) {
      list_books(
        where: {list_id: {_eq: $lid}},
        order_by: [{position: asc_nulls_last}, {date_added: desc}]
      ) {
        id
        position
        book {
          id
          title
          slug
          release_year
          cached_tags
          cached_contributors
          image { url width height }
          editions(
            limit: 20,
            order_by: [{users_count: desc_nulls_last}, {id: asc}],
            where: {
              image: {url: {_is_null: false}},
              language_id: {_eq: 1}
            }
          ) {
            image { url width height }
          }
        }
      }
    }`,
    { lid: listId },
  );

  return data.list_books.map((row) => {
    const b = row.book;
    const authors = extractAuthors(b.cached_contributors);
    return {
      id: b.id,
      title: b.title,
      slug: b.slug,
      author: authors.join(", "),
      authorSort: authors[0] || "",
      tags: extractGenres(b.cached_tags),
      imageUrl: pickBestCover(b),
      releaseYear: b.release_year,
    };
  });
}

function pickBestCover(book) {
  let bestUrl = null;
  let bestArea = 0;
  const consider = (img) => {
    if (!img?.url || !img.width || !img.height) return;
    const area = img.width * img.height;
    if (area > bestArea) {
      bestUrl = img.url;
      bestArea = area;
    }
  };
  consider(book.image);
  for (const ed of book.editions ?? []) consider(ed.image);
  return bestUrl;
}

// -- scoring & extraction helpers --

function scoreHit(doc, { title, author }) {
  let score = 0;
  const docTitle = (doc.title || "").toLowerCase();
  const queryTitle = (title || "").toLowerCase();
  const authors = (doc.author_names || []).map((a) => a.toLowerCase());
  const queryAuthor = (author || "").toLowerCase();

  if (queryTitle && docTitle === queryTitle) score += 50;
  else if (queryTitle && docTitle.includes(queryTitle)) score += 25;

  if (queryAuthor && authors.some((a) => a === queryAuthor)) score += 40;
  else if (queryAuthor && authors.some((a) => a.includes(queryAuthor))) score += 20;

  if (SUMMARY_TITLE_RE.test(doc.title || "")) score -= 60;

  score += Math.min(20, Math.log10((doc.users_count || 0) + 1) * 5);

  const confidence = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  return { score, confidence };
}

function extractAuthors(cachedContributors) {
  if (!Array.isArray(cachedContributors)) return [];
  return cachedContributors
    .filter((c) => !c.contribution || c.contribution === "Author")
    .map((c) => c.author?.name)
    .filter(Boolean);
}

function extractGenres(cachedTags) {
  if (!cachedTags || typeof cachedTags !== "object") return [];
  const genres = cachedTags.Genre || [];
  return genres.map((g) => g.tag).filter(Boolean);
}
