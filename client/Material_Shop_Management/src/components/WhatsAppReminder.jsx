import { useState } from "react";
import { useSelector } from "react-redux";

function WhatsAppReminder({
  messageType,      // "order" | "payment" | "overdue"
  customerName,
  customerPhone,
  orderNumber,
  items,            // array — for order message
  totalAmount,      // for order message
  paidAmount,       // for order message
  paymentAmount,    // for payment message — how much paid this time
  totalPaidSoFar,   // for payment message — total paid so far
  dueAmount,        // remaining balance
  dueDate,
}) {
  const [copied, setCopied] = useState(false);
  const { data: settings }  = useSelector((state) => state.settings);

  const shopName  = settings?.shopName || "Our Shop";
  const shopPhone = settings?.phone    || "";

  const formattedDue = dueDate
    ? new Date(dueDate).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "N/A";

  // ✅ items list for order message
  const itemsList = Array.isArray(items)
    ? items.map((i) => `${i.name} x${i.qty}`).join(", ")
    : "";

  // ── Message 1 — Order Created ────────────────────────────────
  const orderMessage = `Dear ${customerName},

Thank you for your order at ${shopName}!

📋 Order: ${orderNumber}
🛒 Items: ${itemsList}
💰 Total Amount: Rs ${Number(totalAmount || 0).toLocaleString()}
✅ You Paid: Rs ${Number(paidAmount || 0).toLocaleString()}
${Number(dueAmount || 0) > 0
  ? `⏳ Balance Due: Rs ${Number(dueAmount).toLocaleString()}\n📅 Due Date: ${formattedDue}\n\nWe appreciate your business. Please complete the remaining payment on time.`
  : `✅ Payment Complete — Thank you!`
}
📞 ${shopPhone}
— ${shopName}`;

  // ── Message 2 — Payment Received ────────────────────────────
  const paymentMessage = `Dear ${customerName},

Payment received — Thank you!

📋 Order: ${orderNumber}
💵 Amount Paid Now: Rs ${Number(paymentAmount || 0).toLocaleString()}
✅ Total Paid So Far: Rs ${Number(totalPaidSoFar || 0).toLocaleString()}
⏳ Balance Remaining: Rs ${Number(dueAmount || 0).toLocaleString()}
📅 Due Date: ${formattedDue}

Thank you for your payment. Please clear the remaining balance soon.

📞 ${shopPhone}
— ${shopName}`;

  // ── Message 3 — Overdue ──────────────────────────────────────
  const overdueMessage = `Dear ${customerName},

⚠ Payment Overdue Notice

📋 Order: ${orderNumber}
❌ Balance Due: Rs ${Number(dueAmount || 0).toLocaleString()}
📅 Due Date was: ${formattedDue}

Your payment time is complete. Please visit our shop or contact us to clear your balance immediately.

Thank you for your cooperation.

📞 ${shopPhone}
— ${shopName}`;

  // ✅ pick correct message based on type
  const getMessage = () => {
    if (messageType === "order")   return orderMessage;
    if (messageType === "payment") return paymentMessage;
    if (messageType === "overdue") return overdueMessage;
    return overdueMessage;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = getMessage();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy WhatsApp message"
      className={`flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-lg transition whitespace-nowrap
        ${copied
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100"
        }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 1h-7A1.5 1.5 0 003 2.5v10A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5v-10A1.5 1.5 0 0011.5 1z" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          WhatsApp
        </>
      )}
    </button>
  );
}

export default WhatsAppReminder;
