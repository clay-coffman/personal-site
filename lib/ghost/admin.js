import GhostAdminAPI from "@tryghost/admin-api";

const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

const admin_api = new GhostAdminAPI({
  url: GHOST_API_URL,
  key: GHOST_ADMIN_API_KEY,
  version: "v5.0",
});

// create member
export async function createMember(member) {
  // need to add subscription for newsletter
  try {
    const res = await admin_api.members.add(member);
    return res;
  } catch (error) {
    throw error;
  }
}
