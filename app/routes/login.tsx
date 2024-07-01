import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  return (
    <Card className="w-full md:w-96 mx-auto">
      <CardHeader className="prose dark:prose-invert">
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form action="/auth/google" method="post">
          <Button className="w-full">Login with Google</Button>
        </Form>
      </CardContent>
    </Card>
  );
}
