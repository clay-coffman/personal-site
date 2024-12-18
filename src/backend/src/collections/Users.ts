import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: ["admin", "user"],
      defaultValue: "user",
      required: true,
    },
  ],
};
