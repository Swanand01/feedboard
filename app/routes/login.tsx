import { Form } from "@remix-run/react";

export default function Page() {
  return (
    <Form action="/auth/google" method="post">
      <button>Login with Google</button>
    </Form>
  );
}
