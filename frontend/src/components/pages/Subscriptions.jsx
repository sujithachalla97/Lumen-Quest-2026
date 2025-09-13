import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Check, XIcon, Pencil } from "lucide-react";

const initialSubscriptions = [
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
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [open, setOpen] = useState(false);
  const [editSub, setEditSub] = useState(null);

  const [form, setForm] = useState({
    status: "active",
    autoRenew: true,
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleEdit = (sub) => {
    setEditSub(sub);
    setForm({ status: sub.status, autoRenew: sub.autoRenew });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editSub) {
      setSubscriptions(
        subscriptions.map((s) =>
          s.id === editSub.id ? { ...s, ...form } : s
        )
      );
    }
    setOpen(false);
    setEditSub(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-gray-500">Admin View & Control</p>
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
                <th className="p-2 text-left">Actions</th>
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
                      sub.status === "active" ? "text-green-600" : "text-red-600"
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
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(sub)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Auto Renew</Label>
              <Select
                value={form.autoRenew ? "true" : "false"}
                onValueChange={(val) =>
                  handleChange("autoRenew", val === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select auto renew" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>Update Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
