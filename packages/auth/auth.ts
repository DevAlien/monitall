import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type UserRole } from "@prisma/client";
import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@monitall/db";
import { LoginLink, sendEmail } from "@monitall/email";

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`Login link: ${url}`);
          return;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          sendEmail({
            email: identifier,
            subject: "Your Monitall Login Link",
            react: LoginLink({ url, email: identifier }),
          });
        }
        // const user = await db.user.findUnique({
        //   where: {
        //     email: identifier,
        //   },
        //   select: {
        //     emailVerified: true,
        //   },
        // });

        // const templateId = user?.emailVerified
        //   ? process.env.POSTMARK_SIGN_IN_TEMPLATE
        //   : process.env.POSTMARK_ACTIVATION_TEMPLATE;
        // if (!templateId) {
        //   throw new Error("Missing template id");
        // }

        // const result = await postmarkClient.sendEmailWithTemplate({
        //   TemplateId: parseInt(templateId),
        //   To: identifier,
        //   From: provider.from as string,
        //   TemplateModel: {
        //     action_url: url,
        //     product_name: "ASD",
        //   },
        //   Headers: [
        //     {
        //       // Set this to prevent Gmail from threading emails.
        //       // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
        //       Name: "X-Entity-Ref-ID",
        //       Value: new Date().getTime() + "",
        //     },
        //   ],
        // });

        // if (result.ErrorCode) {
        //   throw new Error(result.Message);
        // }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },
  },
};
