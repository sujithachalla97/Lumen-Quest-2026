import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pencil, Trash2, PlusCircle, Check, XIcon } from "lucide-react";

const initialPlans = [
  {
    id: "p1",
    name: "Basic Plan",
    description: "Entry level plan for casual users",
    price: 199,
    quota: "50GB",
    autoRenewAllowed: true,
    status: "active",
  },
  {
    id: "p2",
    name: "Standard Plan",
    description: "Best for small families",
    price: 499,
    quota: "200GB",
    autoRenewAllowed: true,
    status: "active",
  },
  {
    id: "p3",
    name: "Premium Plan",
    description: "Unlimited access for heavy users",
    price: 999,
    quota: "Unlimited",
    autoRenewAllowed: false,
    status: "inactive",
  },
];

export default function Plans() {
  const [plans, setPlans] = useState(initialPlans);
  const [open, setOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    autoRenewAllowed: true,
    quota: "",
    status: "active",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (editPlan) {
      // Update existing
      setPlans(
        plans.map((p) =>
          p.id === editPlan.id ? { ...form, id: editPlan.id } : p
        )
      );
    } else {
      // Add new
      const newPlan = { ...form, id: `p${plans.length + 1}` };
      setPlans([...plans, newPlan]);
    }
    setOpen(false);
    setEditPlan(null);
    setForm({ name: "", description: "", price: "", quota: "", status: "active" });
  };

  const handleEdit = (plan) => {
    setEditPlan(plan);
    setForm(plan);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plans Management</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditPlan(null);
            setForm({
              name: "",
              description: "",
              price: "",
              quota: "",
              autoRenewAllowed: true,
              status: "active",
            });
            setOpen(true);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Quota</th>
                <th className="p-2 text-left">Autorenewd</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2 font-medium">{plan.name}</td>
                  <td className="p-2">{plan.description}</td>
                  <td className="p-2">₹{plan.price}</td>
                  <td className="p-2">{plan.quota}</td>
                  <td className="p-2 flex items-center justify-ceter">
                    {plan.autoRenewAllowed ? 
                        <div className=" p-0.5 w-fit rounded-full bg-green-500">
                            <Check className="h-4 w-4 text-white" />
                        </div>
                        :
                        <div className=" p-0.5 rounded-full bg-red-500 w-fit">
                            <XIcon className="h-4 w-4 text-white" />
                        </div>
                    }
                    </td>
                  <td
                    className={`p-2 font-semibold ${
                      plan.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {plan.status}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(plan)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter plan name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label>Quota</Label>
              <Input
                value={form.quota}
                onChange={(e) => handleChange("quota", e.target.value)}
                placeholder="e.g. 100GB, Unlimited"
              />
            </div>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {editPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
