import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Login oldalt NE védjük!
  // Ez a layout csak az /admin/* oldalakra vonatkozik
  // de a /admin/login-t ki kell venni
  
  return (
    <div className="min-h-screen bg-stone-100 flex">
      {token && <AdminSidebar />}
      <main className={token ? "flex-1 ml-64 p-8" : "flex-1 p-8"}>
        {children}
      </main>
    </div>
  );
}