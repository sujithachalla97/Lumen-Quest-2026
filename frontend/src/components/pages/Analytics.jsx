import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// --- Mock Admin Service with Analytics Data ---
const Admin = {
  analytics: {
    getStats: async () => {
      return [
        { label: "Active Users", value: 850 },
        { label: "Monthly Revenue", value: "$25,300" },
        { label: "Churn Rate", value: "5.2%" },
        { label: "New Signups", value: 120 },
      ];
    },
    getUsageTrends: async () => {
      return [
        { month: "Jan", active: 700, cancelled: 35 },
        { month: "Feb", active: 750, cancelled: 40 },
        { month: "Mar", active: 780, cancelled: 45 },
        { month: "Apr", active: 820, cancelled: 50 },
        { month: "May", active: 850, cancelled: 55 },
      ];
    },
    getRevenueByPlan: async () => {
      return [
        { plan: "Basic", revenue: 5000 },
        { plan: "Standard", revenue: 12000 },
        { plan: "Premium", revenue: 8300 },
      ];
    },
    predictChurn: async () => {
      return [
        {
          userId: "U101",
          userName: "Eve",
          phone: "9123456780",
          email: "eve@example.com",
          status: "Active",
          likelihoodToCancel: 72,
        },
        {
          userId: "U102",
          userName: "Frank",
          phone: "9876541230",
          email: "frank@example.com",
          status: "Inactive",
          likelihoodToCancel: 55,
        },
        {
          userId: "U103",
          userName: "Grace",
          phone: "9988771122",
          email: "grace@example.com",
          status: "Active",
          likelihoodToCancel: 30,
        },
        {
          userId: "U104",
          userName: "Henry",
          phone: "9112233445",
          email: "henry@example.com",
          status: "Active",
          likelihoodToCancel: 15,
        },
      ];
    },
  },
};

export default function Analytics() {
  const [stats, setStats] = useState([]);
  const [usageTrends, setUsageTrends] = useState([]);
  const [revenueByPlan, setRevenueByPlan] = useState([]);
  const [churnPrediction, setChurnPrediction] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setStats(await Admin.analytics.getStats());
      setUsageTrends(await Admin.analytics.getUsageTrends());
      setRevenueByPlan(await Admin.analytics.getRevenueByPlan());
      setChurnPrediction(await Admin.analytics.predictChurn());
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#22c55e"
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#ef4444"
                  name="Cancelled"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Churn Prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">User ID</th>
                  <th className="text-left p-2">User Name</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Likelihood To Cancel</th>
                </tr>
              </thead>
              <tbody>
                {churnPrediction.map((user) => (
                  <tr key={user.userId} className="border-b last:border-0">
                    <td className="p-2">{user.userId}</td>
                    <td className="p-2">{user.userName}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.email}</td>
                    <td
                      className={`p-2 font-semibold ${
                        user.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.status}
                    </td>
                    <td
                      className={`p-2 font-semibold ${
                        user.likelihoodToCancel > 70
                          ? "text-red-600"
                          : user.likelihoodToCancel > 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {user.likelihoodToCancel}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
