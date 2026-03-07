import React, { useEffect } from "react";
import { plans } from "../config/plans";
import { useUser } from "../context/UserContext";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const ReNewPlan = () => {
  const { user } = useUser();
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

  // Load Razorpay script once
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Helper: today + 1 month
  const getExpiryDatePlusOneMonth = (planName) => {
    const now = new Date();
    const expiry = new Date(now);
    if(planName == "premium") {
      expiry.setMonth(expiry.getMonth() + 2); // 2 month for premium users
    }else {
      expiry.setMonth(expiry.getMonth() + 1); 
    }
    return expiry;
  };

  const openRazorpay = async (plan: any) => {
    try {
      if (!window.Razorpay) {
        alert("Payment gateway not loaded yet");
        return;
      }

      if (!user?.uid) {
        alert("User not logged in");
        return;
      }

      const options = {
        key: keyId,
        amount: Math.round(plan.price * 100), // paise
        currency: "INR",
        name: "Chartr",
        description: `${plan.name} Plan`,
        prefill: {
          name: user.username,
          contact: user.phone,
        },
        theme: { color: "#7c3aed" },

        handler: async function (response: any) {
          try {
            const startedAt = new Date();
            const expiresAt = getExpiryDatePlusOneMonth(plan?.name);

            const userRef = doc(db, "users", user.uid);

            await updateDoc(userRef, {
              plan: plan.name,
              purchaseAt: Timestamp.fromDate(startedAt),
              expireAt: Timestamp.fromDate(expiresAt),
            });

            alert("✅ Payment successful! Plan activated.");
          } catch (err) {
            console.error(err);
            alert("Payment succeeded but plan update failed.");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("❌ Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto border flex items-center justify-center flex-col gap-5 py-5">
      {plans.map((p: any) => (
        <div key={p.name} className="card">
          <div className="pricing-block-content">
            <p className="pricing-plan capitalize">{p.name}</p>

            <div className="price-value">
              <p className="price-number">
                ₹<span className="price-integer">{p.price}</span>
              </p>
            </div>

            <div className="pricing-note">{p.duration}</div>

            <ul className="check-list">
              {p.features.map((f: any, i: number) => (
                <li key={i} className="check-list-item">
                  {f.available ? "✔️" : "❌"} {f.title}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openRazorpay(p)}
              className="bg-black text-white py-2 rounded-xl cursor-pointer"
            >
              Buy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReNewPlan;
