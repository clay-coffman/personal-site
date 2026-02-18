import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("books", "routes/books.tsx"),
  route("blog", "routes/blog.tsx"),
  route("projects", "routes/projects.tsx"),
  route("admin/login", "routes/admin_.login.tsx"),
  layout("routes/admin.tsx", [
    route("admin/books", "routes/admin.books.tsx"),
    route("admin/logout", "routes/admin.logout.tsx"),
  ]),
  route("api/books", "routes/api.books.tsx"),
  route("api/health", "routes/api.health.tsx"),
  route("covers/:bookId", "routes/covers.$bookId.tsx"),
] satisfies RouteConfig;
