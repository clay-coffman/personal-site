import { createCookieSessionStorage, redirect } from "react-router";
import { getEnv } from "./env.server";

type FlashMessage = { type: string; text: string };

let sessionStorage: ReturnType<typeof createCookieSessionStorage>;
let _flashStorage: ReturnType<typeof createCookieSessionStorage>;

function getSessionStorage() {
  if (sessionStorage) return sessionStorage;
  sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secrets: [getEnv().SECRET_KEY],
      secure: getEnv().NODE_ENV === "production",
    },
  });
  return sessionStorage;
}

function getFlashStorage() {
  if (_flashStorage) return _flashStorage;
  _flashStorage = createCookieSessionStorage({
    cookie: {
      name: "__flash",
      httpOnly: true,
      maxAge: 10,
      path: "/",
      sameSite: "lax",
      secrets: [getEnv().SECRET_KEY],
      secure: getEnv().NODE_ENV === "production",
    },
  });
  return _flashStorage;
}

export { getFlashStorage as flashSessionStorage };

export async function getFlashMessage(request: Request) {
  const storage = getFlashStorage();
  const session = await storage.getSession(request.headers.get("Cookie"));
  const message = session.get("flash") as FlashMessage | undefined;
  const headers = new Headers();
  headers.append("Set-Cookie", await storage.commitSession(session));
  return { message: message || null, headers };
}

export async function setFlashMessage(
  request: Request,
  message: FlashMessage
) {
  const storage = getFlashStorage();
  const session = await storage.getSession(request.headers.get("Cookie"));
  session.flash("flash", message);
  return {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  };
}

export async function createUserSession(request: Request, userId: string) {
  const storage = getSessionStorage();
  const session = await storage.getSession();
  session.set("userId", userId);
  return {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  };
}

export async function getUserId(request: Request): Promise<string | null> {
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.get("userId") || null;
}

export async function requireAuth(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/admin/login");
  }
  return userId;
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const env = getEnv();
  return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
}

export async function logout(request: Request) {
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
