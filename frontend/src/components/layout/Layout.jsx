import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
