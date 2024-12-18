import { User } from "payload/auth";

export const isAdmin = ({
  req: { user },
}: {
  req: { user: User | null };
}): boolean => {
  return user?.role === "admin";
};
