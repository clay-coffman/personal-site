import GhostContentAPI from "@tryghost/content-api";

const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;

const content_api = new GhostContentAPI({
  url: GHOST_API_URL,
  key: GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

const is404 = (error) => /not found/i.test(error.message);

export async function getPreviewPostBySlug(slug) {
  const params = {
    slug,
    fields: "slug",
    limit: "all",
  };

  try {
    const post = await content_api.posts.read(params);
    return post;
  } catch (error) {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return;
    throw error;
  }
}

export async function getAllPostsWithSlug() {
  const params = {
    fields: "slug",
    limit: "all",
  };
  const posts = await content_api.posts.browse(params);
  return posts;
}

export async function getAllPostsForHome() {
  const params = {
    limit: "all",
    include: "authors",
    order: "published_at DESC",
  };
  try {
    const posts = await content_api.posts.browse(params);
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPostAndMorePosts(slug, preview) {
  const singleObjectParams = {
    slug,
    include: "authors",
    ...(preview && { status: "all" }),
  };
  const moreObjectParams = {
    limit: 3,
    include: "authors",
    ...(preview && { status: "all" }),
  };
  const post = await content_api.posts
    .read(singleObjectParams)
    .catch((error) => {
      // Don't throw if an slug doesn't exist
      if (is404(error)) return;
      throw error;
    });
  const morePosts = (await content_api.posts.browse(moreObjectParams))
    ?.filter(({ slug }) => post.slug !== slug)
    .slice(0, 2);

  return {
    post,
    morePosts,
  };
}
