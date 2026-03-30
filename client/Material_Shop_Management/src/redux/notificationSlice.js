import { createSlice } from "@reduxjs/toolkit";
import { createOrder, updatePayment } from "./orderSlice";
import { setStock, addStock }         from "./inventorySlice";

// ── Helper — time ago ──────────────────────────────────────────────
export const timeAgo = (dateString) => {
  const now  = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

// ── Helper — generate unique id ────────────────────────────────────
const genId = () => `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    items: [],
  },

  reducers: {

    // ✅ manually add notification (used for overdue)
    addNotification(state, action) {
      const {
        type, title, message,
        orderId, customerId, customerName, customerPhone,
        orderNumber, dueAmount, dueDate, phone,
      } = action.payload;

      // ✅ prevent duplicate overdue notifications
      if (type === "overdue") {
        const exists = state.items.some(
          (n) => n.type === "overdue" && n.orderId === orderId
        );
        if (exists) return;
      }

      state.items.unshift({
        id:            genId(),
        type,
        title,
        message,
        orderId:       orderId       || null,
        customerId:    customerId    || null,
        customerName:  customerName  || null,
        customerPhone: customerPhone || phone || null,
        orderNumber:   orderNumber   || null,
        dueAmount:     dueAmount     || null,
        dueDate:       dueDate       || null,
        time:          new Date().toISOString(),
        read:          false,
      });

      // keep max 50 notifications
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50);
      }
    },

    // ✅ mark single as read
    markAsRead(state, action) {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },

    // ✅ mark all as read
    markAllRead(state) {
      state.items.forEach((n) => { n.read = true; });
    },

    // ✅ delete single
    deleteNotification(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },

    // ✅ clear all
    clearAll(state) {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ── Order Created ──────────────────────────────────────────
      .addCase(createOrder.fulfilled, (state, action) => {
        const order    = action.payload;
        const customer = order?.customer;

        state.items.unshift({
          id:            genId(),
          type:          "order",
          title:         "New Order Created",
          message:       `${order?.orderNumber} — ${customer?.name || "Customer"} — Rs ${(order?.totalAmount || 0).toLocaleString()}`,
          orderId:       order?._id         || null,
          customerId:    customer?._id      || null,
          customerName:  customer?.name     || null,
          customerPhone: customer?.phone    || null,
          orderNumber:   order?.orderNumber || null,
          items:         order?.items       || [],
          totalAmount:   order?.totalAmount || 0,
          paidAmount:    order?.paidAmount  || 0,
          dueAmount:     order?.dueAmount   || 0,
          dueDate:       order?.dueDate     || null,
          time:          new Date().toISOString(),
          read:          false,
        });

        // keep max 50
        if (state.items.length > 50) {
          state.items = state.items.slice(0, 50);
        }
      })

      // ── Payment Received ───────────────────────────────────────
      .addCase(updatePayment.fulfilled, (state, action) => {
        const order    = action.payload;
        const customer = order?.customer;
        const lastPay  = order?.paymentHistory?.[order.paymentHistory.length - 1];

        state.items.unshift({
          id:             genId(),
          type:           "payment",
          title:          "Payment Received",
          message:        `Rs ${(lastPay?.amount || 0).toLocaleString()} received from ${customer?.name || "Customer"} — Balance: Rs ${(order?.dueAmount || 0).toLocaleString()}`,
          orderId:        order?._id         || null,
          customerId:     customer?._id      || null,
          customerName:   customer?.name     || null,
          customerPhone:  customer?.phone    || null,
          orderNumber:    order?.orderNumber || null,
          paymentAmount:  lastPay?.amount    || 0,
          totalPaidSoFar: order?.paidAmount  || 0,
          dueAmount:      order?.dueAmount   || 0,
          dueDate:        order?.dueDate     || null,
          time:           new Date().toISOString(),
          read:           false,
        });

        // keep max 50
        if (state.items.length > 50) {
          state.items = state.items.slice(0, 50);
        }
      })

      // ── Stock Updated — setStock ───────────────────────────────
      .addCase(setStock.fulfilled, (state, action) => {
        const product = action.payload;
        if (!product) return;

        if (product.status === "Out Stock") {
          state.items.unshift({
            id:      genId(),
            type:    "stock",
            title:   "Out of Stock",
            message: `${product.name} is OUT OF STOCK. Immediate reorder required.`,
            time:    new Date().toISOString(),
            read:    false,
          });
        } else if (product.status === "Low Stock") {
          state.items.unshift({
            id:      genId(),
            type:    "stock",
            title:   "Low Stock Alert",
            message: `${product.name} stock is low — ${product.stock} ${product.unit} left.`,
            time:    new Date().toISOString(),
            read:    false,
          });
        }

        if (state.items.length > 50) {
          state.items = state.items.slice(0, 50);
        }
      })

      // ── Stock Updated — addStock ───────────────────────────────
      .addCase(addStock.fulfilled, (state, action) => {
        const product = action.payload;
        if (!product) return;

        if (product.status === "Out Stock") {
          state.items.unshift({
            id:      genId(),
            type:    "stock",
            title:   "Out of Stock",
            message: `${product.name} is OUT OF STOCK. Immediate reorder required.`,
            time:    new Date().toISOString(),
            read:    false,
          });
        } else if (product.status === "Low Stock") {
          state.items.unshift({
            id:      genId(),
            type:    "stock",
            title:   "Low Stock Alert",
            message: `${product.name} stock is low — ${product.stock} ${product.unit} left.`,
            time:    new Date().toISOString(),
            read:    false,
          });
        }

        if (state.items.length > 50) {
          state.items = state.items.slice(0, 50);
        }
      });
  },
});

export const {
  addNotification,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearAll,
} = notificationSlice.actions;

export default notificationSlice.reducer;
