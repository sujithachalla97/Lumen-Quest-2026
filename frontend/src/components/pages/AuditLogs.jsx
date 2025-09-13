import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// 🔹 Mock Data
const initialLogs = [
  {
    id: "l1",
    userId: "U001",
    action: "Created",
    entity: "Plan",
    timestamp: "2025-09-10 10:30 AM",
  },
  {
    id: "l2",
    userId: "Admin01",
    action: "Deleted",
    entity: "Discount",
    timestamp: "2025-09-11 02:15 PM",
  },
  {
    id: "l3",
    userId: "U002",
    action: "Updated",
    entity: "Subscription",
    timestamp: "2025-09-12 05:00 PM",
  },
  {
    id: "l4",
    userId: "Admin01",
    action: "Created",
    entity: "Plan",
    timestamp: "2025-09-13 09:20 AM",
  },
];

export default function AuditLogs() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");

  // Filter logs by userId or action
  const filteredLogs = logs.filter(
    (log) =>
      log.userId.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>

      {/* Search Bar */}
      <div className="flex justify-end">
        <Input
          placeholder="Search by user, action, or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 text-left">Log ID</th>
                <th className="p-2 text-left">User ID</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Entity</th>
                <th className="p-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.userId}</td>
                    <td className="p-2 font-medium">{log.action}</td>
                    <td className="p-2">{log.entity}</td>
                    <td className="p-2">{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No matching logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
