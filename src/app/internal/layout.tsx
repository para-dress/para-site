import { redirect } from "next/navigation";
import { InternalSidebar } from "@/components/internal/InternalSidebar";
import { InternalTopbar } from "@/components/internal/InternalTopbar";
import { isDashboardAuthenticated } from "@/lib/internal-dashboard";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isDashboardAuthenticated();

  if (!authenticated) {
    redirect("/internal/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f0ea_0%,#efe3dc_100%)] px-6 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <InternalTopbar />
        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
          <InternalSidebar />
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
