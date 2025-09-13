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

// --- Mock Admin Service with Data ---
const Admin = {
  analytics: {
    getStats: async () => {
      return [
        { label: "Active Plans", value: 12 },
        { label: "Active Subscriptions", value: 320 },
        { label: "Cancelled Subscriptions", value: 45 },
        { label: "Revenue (Mock)", value: "$12,450" },
      ];
    },
    getSubscriptionTrends: async () => {
      return [
        { month: "Jan", active: 120, cancelled: 10 },
        { month: "Feb", active: 150, cancelled: 15 },
        { month: "Mar", active: 170, cancelled: 18 },
        { month: "Apr", active: 200, cancelled: 20 },
        { month: "May", active: 220, cancelled: 25 },
      ];
    },
    getTopPlans: async () => {
      return [
        { plan: "Basic", subscriptions: 120 },
        { plan: "Standard", subscriptions: 180 },
        { plan: "Premium", subscriptions: 90 },
      ];
    },
    predictChurn: async () => {
      return [
        { userId: "U001", userName: "Alice", likelihoodToCancel: 80, phone: "9876543210", email: "alice@example.com", status: "Active" },
        { userId: "U002", userName: "Bob", likelihoodToCancel: 65, phone: "9876501234", email: "bob@example.com", status: "Inactive" },
        { userId: "U003", userName: "Charlie", likelihoodToCancel: 40, phone: "9123456789", email: "charlie@example.com", status: "Active" },
        { userId: "U004", userName: "David", likelihoodToCancel: 25, phone: "9988776655", email: "david@example.com", status: "Active" },
      ];
    },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [subscriptionTrends, setSubscriptionTrends] = useState([]);
  const [topPlans, setTopPlans] = useState([]);
  const [churnPrediction, setChurnPrediction] = useState([]);

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      setStats(await Admin.analytics.getStats());
      setSubscriptionTrends(await Admin.analytics.getSubscriptionTrends());
      setTopPlans(await Admin.analytics.getTopPlans());
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
        {/* Subscription Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriptionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#4CAF50" name="Active" />
                <Line type="monotone" dataKey="cancelled" stroke="#F87171" name="Cancelled" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Top Plans</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPlans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="subscriptions" fill="#3B82F6" />
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
                      user.status === "Active" ? "text-green-600" : "text-red-600"
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
        </CardContent>
      </Card>
    </div>
  );
}
