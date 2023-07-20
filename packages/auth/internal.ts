import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { serialize } from "cookie";
import { AuthOptions, CallbacksOptions, Session } from "next-auth";
import { AuthHandler } from "next-auth/core";
import { Cookie } from "next-auth/core/lib/cookie";

// @ts-expect-error
export function setCookie(res, cookie: Cookie) {
  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader("Set-Cookie") ?? [];
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader];
  }
  const { name, value, options } = cookie;
  const cookieHeader = serialize(name, value, options);
  setCookieHeader.push(cookieHeader);
  res.setHeader("Set-Cookie", setCookieHeader);
}

type GetServerSessionOptions = Partial<Omit<AuthOptions, "callbacks">> & {
  callbacks?: Omit<AuthOptions["callbacks"], "session"> & {
    session?: (...args: Parameters<CallbacksOptions["session"]>) => any;
  };
};

type GetServerSessionParams<O extends GetServerSessionOptions> =
  | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"], O]
  | [NextApiRequest, NextApiResponse, O]
  | [O]
  | [];

let experimentalRSCWarningShown = false;

export async function __internal__unstable__getSession<
  O extends GetServerSessionOptions,
  R = O["callbacks"] extends { session: (...args: Array<any>) => infer U }
    ? U
    : Session,
>(...args: GetServerSessionParams<O>): Promise<R | null> {
  const isRSC = args.length === 0 || args.length === 1;
  if (
    !experimentalRSCWarningShown &&
    isRSC &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn(
      "[next-auth][warn][EXPERIMENTAL_API]",
      "\n`getServerSession` is used in a React Server Component.",
      `\nhttps://next-auth.js.org/configuration/nextjs#getServerSession}`,
      `\nhttps://next-auth.js.org/warnings#EXPERIMENTAL_API`,
    );
    experimentalRSCWarningShown = true;
  }

  // @ts-expect-error
  let req, res, options: AuthOptions;
  if (isRSC) {
    options = Object.assign({}, args[0], { providers: [] });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { headers, cookies } = require("next/headers");
    req = {
      headers: Object.fromEntries(headers() as Headers),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          // @ts-expect-error
          .map((c) => [c.name, c.value]),
      ),
    };
    res = { getHeader() {}, setCookie() {}, setHeader() {} };
  } else {
    req = args[0];
    res = args[1];
    options = Object.assign({}, args[2], { providers: [] });
  }

  options.secret ??= process.env.NEXTAUTH_SECRET;

  const session = await AuthHandler<Session | {} | string>({
    options,
    req: {
      action: "session",
      method: "GET",
      cookies: req.cookies,
      headers: req.headers,
    },
  });

  const { body, cookies, status = 200 } = session;

  // @ts-expect-error
  cookies?.forEach((cookie) => setCookie(res, cookie));

  if (body && typeof body !== "string" && Object.keys(body).length) {
    if (status === 200) {
      // @ts-expect-error
      if (isRSC) delete body.expires;
      return body as R;
    }
    throw new Error((body as any).message);
  }

  return null;
}
