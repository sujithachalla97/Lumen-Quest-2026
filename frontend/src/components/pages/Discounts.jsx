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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const initialDiscounts = [
  {
    id: "d1",
    code: "NEW50",
    description: "50% off for new users",
    percentage: 50,
    validFrom: "2025-09-01",
    validTo: "2025-09-30",
    status: "active",
  },
  {
    id: "d2",
    code: "FESTIVE20",
    description: "20% festive discount",
    percentage: 20,
    validFrom: "2025-10-01",
    validTo: "2025-10-15",
    status: "inactive",
  },
];

export default function Discounts() {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [open, setOpen] = useState(false);
  const [editDiscount, setEditDiscount] = useState(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    percentage: "",
    validFrom: "",
    validTo: "",
    status: "active",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const resetForm = () =>
    setForm({
      code: "",
      description: "",
      percentage: "",
      validFrom: "",
      validTo: "",
      status: "active",
    });

  const handleSubmit = () => {
    if (editDiscount) {
      setDiscounts(
        discounts.map((d) =>
          d.id === editDiscount.id ? { ...form, id: editDiscount.id } : d
        )
      );
    } else {
      const newDiscount = { ...form, id: `d${discounts.length + 1}` };
      setDiscounts([...discounts, newDiscount]);
    }
    setOpen(false);
    setEditDiscount(null);
    resetForm();
  };

  const handleEdit = (discount) => {
    setEditDiscount(discount);
    setForm(discount);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditDiscount(null);
            resetForm();
            setOpen(true);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          Add Discount
        </Button>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Percentage</th>
                <th className="p-2 text-left">Valid From</th>
                <th className="p-2 text-left">Valid To</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr
                  key={discount.id}
                  className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2 font-medium">{discount.code}</td>
                  <td className="p-2">{discount.description}</td>
                  <td className="p-2">{discount.percentage}%</td>
                  <td className="p-2 text-xs">{discount.validFrom}</td>
                  <td className="p-2 text-xs">{discount.validTo}</td>
                  <td
                    className={`p-2 font-semibold ${
                      discount.status === "active"
                        ? "text-green-600"
                        : discount.status === "inactive"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {discount.status}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(discount)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(discount.id)}
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

      {/* Add/Edit Discount Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDiscount ? "Edit Discount" : "Add New Discount"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Enter discount code"
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
              <Label>Percentage (%)</Label>
              <Input
                type="number"
                value={form.percentage}
                onChange={(e) => handleChange("percentage", e.target.value)}
                placeholder="Enter percentage"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Valid From</Label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => handleChange("validFrom", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>Valid To</Label>
                <Input
                  type="date"
                  value={form.validTo}
                  onChange={(e) => handleChange("validTo", e.target.value)}
                />
              </div>
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
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {editDiscount ? "Update Discount" : "Create Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
