import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — La Familia" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-carbon-950 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
