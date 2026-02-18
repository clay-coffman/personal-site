import { Form, Link, useActionData } from "react-router";
import type { MetaFunction } from "react-router";
import { Card, CardBody } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icon } from "~/components/ui/icon";

export const meta: MetaFunction = () => {
  return [{ title: "Admin Login - Clay Coffman" }];
};

export { loader, action } from "~/lib/admin-login.server";

export default function AdminLogin() {
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Card className="shadow-md">
          <CardBody className="p-8">
            <h2 className="text-h3 mb-6 text-center text-foreground">
              Admin Login
            </h2>

            {actionData?.error && (
              <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-body-sm text-red-800">
                {actionData.error}
              </div>
            )}

            <Form method="post">
              <div className="mb-4">
                <Label htmlFor="username" className="mb-1.5 block">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="password" className="mb-1.5 block">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </Form>

            <div className="mt-4 text-center">
              <Link to="/" className="text-body-sm">
                <Icon name="arrow-left" size={14} className="mr-1" /> Back to
                Home
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
