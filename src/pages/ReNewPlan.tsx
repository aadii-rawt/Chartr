import React, { useEffect, useState } from "react";
import { plans } from "../config/plans";
import { useUser } from "../context/UserContext";
import {
  doc,
  updateDoc,
  Timestamp,
  getDoc,
  increment,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const ReNewPlan = () => {
  const { user } = useUser();
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

  const [referralAvailable, setReferralAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Razorpay
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 🔥 Fetch referral devices
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setReferralAvailable((data.referredDevices || 0) > 0);
      }
      setLoading(false);
    };
    fetchUser();
  }, [user]);

  // Expiry logic
  const getExpiryDatePlusOneMonth = (planName: string) => {
    const now = new Date();
    const expiry = new Date(now);

    if (planName === "premium") {
      expiry.setMonth(expiry.getMonth() + 2);
    } else {
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

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert("User not found");
        return;
      }

      const userData = snap.data();
      const hasReferral: any = (userData.referredDevices || 0) > 0;

      const discount = hasReferral ? hasReferral * 150 : 0;
      const finalPrice = Math.max(plan.price - discount, 1);
      const startedAt = new Date();
      const transactionData = {
        username: user.username,
        amount: finalPrice,
        date: Timestamp.fromDate(startedAt),
        plan: plan.name,
        status: ""
      }

      const options = {
        key: keyId,
        amount: Math.round(finalPrice * 100),
        currency: "INR",
        name: "Chartr",
        description: `${plan.name} Plan`,

        prefill: {
          name: user.username,
          contact: user.phone,
        },

        theme: { color: "#7c3aed" },

        handler: async function () {
          try {

            const expiresAt = getExpiryDatePlusOneMonth(plan.name);

            const updateData: any = {
              plan: plan.name,
              purchaseAt: Timestamp.fromDate(startedAt),
              expireAt: Timestamp.fromDate(expiresAt),
            };

            if (hasReferral) {
              updateData.referredDevices = increment(-1);
            }

            await updateDoc(userRef, updateData);

            // transaction history
            const userPassDocRef = doc(db, 'transactions', "history");
            const docSnap = await getDoc(userPassDocRef);

            const finalData = { ...transactionData, status: "success" }
            if (docSnap.exists()) {
              await updateDoc(userPassDocRef, {
                passes: arrayUnion(finalData),
              });
            } else {
              await setDoc(userPassDocRef, {
                passes: [finalData],
              });
            }

            alert(
              hasReferral
                ? "✅ Plan activated with ₹150 discount!"
                : "✅ Plan activated!"
            );
          } catch (err) {
            console.error(err);
            alert("Payment succeeded but update failed.");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        // transaction history
        const userPassDocRef = doc(db, 'transactions', "history");
        const docSnap = await getDoc(userPassDocRef);

        const finalData = { ...transactionData, status: "failed" }
        if (docSnap.exists()) {
          await updateDoc(userPassDocRef, {
            passes: arrayUnion(finalData),
          });
        } else {
          await setDoc(userPassDocRef, {
            passes: [finalData],
          });
        }
        alert("❌ Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto border flex items-center justify-center flex-col gap-5 py-5">
      {plans.map((p: any) => {
        const discountedPrice = referralAvailable
          ? Math.max(p.price - 150, 1)
          : p.price;

        return (
          <div key={p.name} className="card">
            <div className="pricing-block-content">

              <p className="pricing-plan capitalize">{p.name}</p>

              <div className="price-value">
                <p className="price-number">
                  {referralAvailable && (
                    <span className="line-through text-gray-400 mr-2 text-sm">
                      ₹{p.price}
                    </span>
                  )}
                  ₹
                  <span className="price-integer">
                    {discountedPrice}
                  </span>
                </p>
              </div>

              {/* 🔥 SHOW DISCOUNT MESSAGE */}
              {referralAvailable && (
                <p className="text-xs text-green-500">
                  🎉 ₹150 referral discount applied
                </p>
              )}

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
                className="bg-black text-white py-2 rounded-xl cursor-pointer w-full"
              >
                Pay ₹{discountedPrice}
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReNewPlan;