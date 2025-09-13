import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Percent,
  BarChart2,
  FileText
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Plans Management", href: "/admin/plans", icon: Package },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: Users },
  { name: "Discounts", href: "/admin/discounts", icon: Percent },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 shadow-lg flex flex-col">
      <div className="p-4 text-xl font-bold text-center border-b dark:border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
