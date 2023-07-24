"use server";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function SiteHomePage({}: { params: { domain: string } }) {
  //   if (!data) {
  //     notFound();
  //   }

  return (
    <>
      <div className="mb-20 w-full">site</div>
    </>
  );
}
