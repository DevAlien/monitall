export function getSubdomain(slug: string): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace("app.", slug + ".");
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
