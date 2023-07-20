// import "@monitall/ui/styles.css";
// import "../styles/globals.css";

import { notFound } from "next/navigation";
import { getCurrentUser } from "@monitall/auth";
import { db } from "@monitall/db";
import { Organization } from "@prisma/client";

import { dashboardNav } from "~/app/config";
import { Sidebar } from "../components/sidebar";

export default async function RootLayout(props: {
  children: React.ReactNode;
  // modal: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const teams = await db.organization.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!teams || teams.length === 0) {
    return notFound();
  }
  const currentTeam = teams.find(
    (team: Organization) => team.slug === props.params.slug,
  );
  if (!currentTeam) {
    return notFound();
  }
  return (
    <main>
      <div className="bg-background">
        <div className="grid grid-cols-3 lg:grid-cols-5">
          <Sidebar items={dashboardNav} slug={props.params.slug} />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              {/* {props.modal} */}
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
