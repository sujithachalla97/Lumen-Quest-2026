const Admin = {
  plans: {
    getAllPlans: {
      method: "GET",
      url: "/api/plans",
      response: [
        {
          id: "string",
          name: "string",
          price: "number",
          quota: "string",
          status: "active | inactive"
        }
      ]
    },
    getPlanById: {
      method: "GET",
      url: "/api/plans/{id}",
      response: {
        id: "string",
        name: "string",
        description: "string",
        price: "number",
        quota: "string",
        features: ["string"],
        status: "active | inactive"
      }
    },
    createPlan: {
      method: "POST",
      url: "/api/plans",
      request: {
        name: "string",
        description: "string",
        price: "number",
        quota: "string",
        features: ["string"]
      },
      response: {
        message: "Plan created successfully",
        planId: "string"
      }
    },
    updatePlan: {
      method: "PUT",
      url: "/api/plans/{id}",
      request: {
        name: "string",
        description: "string",
        price: "number",
        quota: "string",
        features: ["string"],
        status: "active | inactive"
      },
      response: {
        message: "Plan updated successfully"
      }
    },
    deletePlan: {
      method: "DELETE",
      url: "/api/plans/{id}",
      response: {
        message: "Plan deleted successfully"
      }
    }
  },

  subscriptions: {
    getUserSubscriptions: {
      method: "GET",
      url: "/api/subscriptions/user/{userId}",
      response: [
        {
          id: "string",
          planId: "string",
          planName: "string",
          status: "active | cancelled | expired",
          startDate: "ISODate",
          endDate: "ISODate",
          autoRenew: true
        }
      ]
    },
    createSubscription: {
      method: "POST",
      url: "/api/subscriptions",
      request: {
        userId: "string",
        planId: "string",
        autoRenew: true
      },
      response: {
        message: "Subscription created successfully",
        subscriptionId: "string"
      }
    },
    updateSubscription: {
      method: "PUT",
      url: "/api/subscriptions/{id}",
      request: {
        planId: "string",
        autoRenew: true,
        status: "active | cancelled"
      },
      response: {
        message: "Subscription updated successfully"
      }
    },
    cancelSubscription: {
      method: "DELETE",
      url: "/api/subscriptions/{id}",
      response: {
        message: "Subscription cancelled successfully"
      }
    }
  },

  discounts: {
    getAllDiscounts: {
      method: "GET",
      url: "/api/discounts",
      response: [
        {
          id: "string",
          code: "string",
          description: "string",
          percentage: "number",
          validFrom: "ISODate",
          validTo: "ISODate",
          status: "active | expired"
        }
      ]
    },
    createDiscount: {
      method: "POST",
      url: "/api/discounts",
      request: {
        code: "string",
        description: "string",
        percentage: "number",
        validFrom: "ISODate",
        validTo: "ISODate"
      },
      response: {
        message: "Discount created successfully",
        discountId: "string"
      }
    }
  },

  analytics: {
    getTopPlans: {
      method: "GET",
      url: "/api/analytics/top-plans?period=month|year",
      response: [
        {
          planId: "string",
          planName: "string",
          subscriptions: "number"
        }
      ]
    },
    getSubscriptionTrends: {
      method: "GET",
      url: "/api/analytics/trends",
      response: {
        month: "string",
        activeSubscriptions: "number",
        cancelledSubscriptions: "number"
      }
    },
    predictChurn: {
      method: "GET",
      url: "/api/analytics/churn",
      response: [
        {
          userId: "string",
          userName: "string",
          likelihoodToCancel: "number (0-100)"
        }
      ]
    }
  }
};

export default Admin;
