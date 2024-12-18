import { CollectionConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "rating", "dateCompleted"],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      min: 1,
      max: 5,
      required: false,
    },
    {
      name: "dateCompleted",
      type: "date",
      required: false,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: 'media',
      required: false,
    },
    {
      name: "genre",
      type: "select",
      options: [
        "fiction",
        "nonFiction",
        "biography",
        "history",
        "science",
        "technology",
      ],
      required: false,
    },
  ],
};
