import { Sidebar } from "~/app/app/(dashboard)/components/sidebar";
import { homeDashboardNav } from "~/app/config";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function RootLayout(props: {
  children: React.ReactNode;
  // modal: React.ReactNode;
}) {
  return (
    <main>
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar items={homeDashboardNav} />
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
