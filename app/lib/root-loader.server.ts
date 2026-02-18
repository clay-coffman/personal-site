import type { LoaderFunctionArgs } from "react-router";
import { getFlashMessage } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { message, headers } = await getFlashMessage(request);
  return new Response(
    JSON.stringify({ flashMessage: message }),
    {
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers.entries()),
      },
    }
  );
}
