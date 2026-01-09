"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// <<< DEFINE menuItems HERE
const menuItems = [
  { name: "Dashboard 360", path: "/admin/Dashboard360" },
  { name: "Live Inventory", path: "/admin/LiveInventory" },
  { name: "Order Details", path: "/admin/orderdetails" },
  { name: "SKU Wise Details", path: "/admin/skuWiseDetails" },
  { name: "Win Details", path: "/admin/winDetails" },
  { name: "User list", path: "/admin/users-list" },
  { name: "Overdue Details", path: "/admin/overdueDetails" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 min-w-[16rem] bg-black text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                pathname.toLowerCase().startsWith(item.path.toLowerCase())
                  ? "bg-gray-900"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Right Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
