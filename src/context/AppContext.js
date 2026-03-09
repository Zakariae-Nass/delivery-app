import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (orderId, updates) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, ...updates } : o)));
  };

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{ orders, setOrders, addOrder, updateOrder, notifications, addNotification, markAllRead }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
