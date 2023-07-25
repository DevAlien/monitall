import { redirect } from "next/navigation";

import { executeInvite } from "./actions";

export default async function Invite(props: { params: { id: string } }) {
  const result = await executeInvite({ token: props.params.id });
  if (result.organization) {
    redirect(`/${result.organization.slug}`);
  }
  if (result.message) {
    return <div>{result.message}</div>;
  }
}
