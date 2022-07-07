import GhostAdminAPI from "@tryghost/admin-api";

const admin_api = new GhostAdminAPI({
  url: process.env.GHOST_ADMIN_API_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
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
