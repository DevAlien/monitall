import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth";

// import { __internal__unstable__getSession } from "./internal";

export async function getCurrentUser() {
  // const session = await __internal__unstable__getSession(authOptions);
  const session = await getServerSession(authOptions);
  return session?.user;
}
