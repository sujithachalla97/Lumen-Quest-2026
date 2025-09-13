import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const SubContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [userSubs, setUserSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load plans once
    let mounted = true;
    api.getPlans().then((p) => {
      if (mounted) setPlans(p);
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getSubscriptionsByUser(user.id).then((s) => {
      setUserSubs(s);
      setLoading(false);
    });
  }, [user]);

  const refreshUserSubs = async () => {
    if (!user) return;
    setLoading(true);
    const s = await api.getSubscriptionsByUser(user.id);
    setUserSubs(s);
    setLoading(false);
  };

  const subscribe = async (planId) => {
    const res = await api.subscribe({ userId: user.id, planId });
    await refreshUserSubs();
    return res;
  };

  const changePlan = async (subId, newPlanId) => {
    const res = await api.changePlan({ subId, newPlanId });
    await refreshUserSubs();
    return res;
  };

  const cancel = async (subId) => {
    const res = await api.cancelSubscription(subId);
    await refreshUserSubs();
    return res;
  };

  const renew = async (subId) => {
    const res = await api.renewSubscription(subId);
    await refreshUserSubs();
    return res;
  };

  return (
    <SubContext.Provider
      value={{
        plans,
        userSubs,
        loading,
        subscribe,
        changePlan,
        cancel,
        renew,
        refreshUserSubs,
      }}
    >
      {children}
    </SubContext.Provider>
  );
};

export const useSubscriptions = () => useContext(SubContext);
