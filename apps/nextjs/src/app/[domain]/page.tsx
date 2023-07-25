"use server";

import { Card, CardContent } from "@monitall/ui/card";

import { StatusDrops } from "./components/status-drops";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function SiteHomePage({}: { params: { domain: string } }) {
  //   if (!data) {
  //     notFound();
  //   }

  return (
    <>
      <div className="mb-20 w-full">
        <div className="inheri flex place-content-center">
          <Card className="w-full max-w-lg">
            <CardContent>
              <StatusDrops
                data={Array.from({ length: 24 }).map(() => {
                  return { color: "red", tooltip: "120 ms" };
                })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
