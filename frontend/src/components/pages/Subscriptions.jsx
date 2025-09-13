import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, XIcon } from "lucide-react";

const subscriptions = [
  {
    id: "s1",
    userId: "U001",
    userName: "Alice",
    phone: "9876543210",
    email: "alice@example.com",
    planName: "Basic Plan",
    status: "active",
    startDate: "2025-09-01",
    endDate: "2025-10-01",
    autoRenew: true,
  },
  {
    id: "s2",
    userId: "U002",
    userName: "Bob",
    phone: "9123456789",
    email: "bob@example.com",
    planName: "Standard Plan",
    status: "inactive",
    startDate: "2025-07-01",
    endDate: "2025-08-01",
    autoRenew: false,
  },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-gray-500">Admin View Only</p>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Start Date</th>
                <th className="p-2 text-left">End Date</th>
                <th className="p-2 text-left">Auto Renew</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2">{sub.userId}</td>
                  <td className="p-2">{sub.userName}</td>
                  <td className="p-2">{sub.phone}</td>
                  <td className="p-2">
                    <a
                      href={`mailto:${sub.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {sub.email}
                    </a>
                  </td>
                  <td
                    className={`p-2 font-semibold ${
                      sub.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sub.status}
                  </td>
                  <td className="p-2">{sub.planName}</td>
                  <td className="p-2 text-xs">{sub.startDate}</td>
                  <td className="p-2 text-xs">{sub.endDate}</td>
                  <td className="p-2">
                    {sub.autoRenew ? (
                      <div className="p-0.5 w-fit rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="p-0.5 rounded-full bg-red-500 w-fit">
                        <XIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
