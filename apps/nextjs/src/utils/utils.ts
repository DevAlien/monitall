export function getSubdomain(slug: string): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return process.env.NEXT_PUBLIC_APP_URL!.replace("app.", slug + ".");
}

export function getStatusPageLink(
  slug: string,
  customDomain: string | null,
): string {
  if (customDomain) {
    return customDomain;
  }
  return getSubdomain(slug);
}

export const genKey = (length: number) => {
  return Array.from({ length }, () =>
    ((Math.random() * 36) | 0).toString(36),
  ).join("");
};
