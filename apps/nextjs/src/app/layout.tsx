import "@monitall/ui/styles.css";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";

import { cn } from "@monitall/ui";
import { Toaster } from "@monitall/ui/toaster";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/style.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontCal = LocalFont({
  src: "../styles/calsans.ttf",
  variable: "--font-cal",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="bg-background">
        <body
          className={cn(
            "min-h-screen antialiased",
            fontSans.variable,
            fontCal.variable,
            "font-sans",
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{props.children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
