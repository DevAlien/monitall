import { useParams } from "next/navigation";

export function useOrganizationSlug() {
  const params = useParams();
  if (!params?.slug) {
    return null;
  }

  return params?.slug as string;
}
