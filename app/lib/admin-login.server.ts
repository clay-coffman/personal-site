import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { login, createUserSession, getUserId } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/admin/books");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const isValid = await login(username, password);
  if (!isValid) {
    return { error: "Invalid username or password" };
  }

  const { headers: sessionHeaders } = await createUserSession(
    request,
    username
  );
  return redirect("/admin/books", { headers: sessionHeaders });
}
