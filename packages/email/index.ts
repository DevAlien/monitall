import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

import LoginLink from "./emails/login";

export { LoginLink };
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test,
}: {
  email: string | string[];
  subject: string;
  react:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | null
    | undefined;
  marketing?: boolean;
  test?: boolean;
}) => {
  return resend.emails.send({
    from: marketing
      ? "Goncalo <goncalo@monitall.app>"
      : "Monitall <system@monitall.app>",
    to: test ? "delivered@resend.dev" : email,
    subject,
    react,
  });
};
