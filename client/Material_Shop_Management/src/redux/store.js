import { configureStore }   from "@reduxjs/toolkit";
import authReducer            from "./authSlice";
import settingsReducer        from "./settingsSlice";
import productReducer         from "./productSlice";
import customerReducer        from "./customerSlice";
import inventoryReducer       from "./inventorySlice";
import orderReducer           from "./orderSlice";
import reportReducer          from "./reportSlice";
import dashboardReducer       from "./dashboardSlice";
import notificationReducer    from "./notificationSlice";

// ✅ load notifications from localStorage on startup
const loadNotifications = () => {
  try {
    const saved = localStorage.getItem("notifications");
    if (!saved) return undefined;
    return { items: JSON.parse(saved) };
  } catch {
    return undefined;
  }
};

// ✅ save notifications to localStorage on every change
const saveNotifications = (items) => {
  try {
    localStorage.setItem("notifications", JSON.stringify(items));
  } catch {
    // storage full or private mode — ignore
  }
};

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    settings:      settingsReducer,
    products:      productReducer,
    customers:     customerReducer,
    inventory:     inventoryReducer,
    orders:        orderReducer,
    reports:       reportReducer,
    dashboard:     dashboardReducer,
    notifications: notificationReducer,
  },

  // ✅ load saved notifications as initial state
  preloadedState: {
    notifications: loadNotifications(),
  },
});

// ✅ subscribe — save to localStorage every time notifications change
store.subscribe(() => {
  const state = store.getState();
  saveNotifications(state.notifications.items);
});
