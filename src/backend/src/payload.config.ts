import { buildConfig } from "payload/config";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { Books } from "./collections/Books";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),
  collections: [Books, Users, Media],
  storage: {
    vercelBlob: vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
  cors: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com",
  ],
});
