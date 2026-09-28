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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getReferal from "../utils/getReferal";
import { getDiscountPirce } from "../utils/utils";
import subscriptionExpireAt from "../utils/getExpireDate";
import api from "../api/axios";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const ReNewPlan = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

  const [referralAvailable, setReferralAvailable] = useState(0);
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

  // ------ get user refferal count -------------
  useEffect(() => {
    getReferal(user, setReferralAvailable, setLoading);
  }, [user]);



  const handlePayment = async (plan: any) => {
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

      // const discount = hasReferral ? hasReferral * 150 : 0;
      // const finalPrice = Math.max(plan.price - discount, 1);
      const finalPrice = getDiscountPirce(plan.price, referralAvailable);
      const startedAt = new Date();
      const transactionData = {
        username: user.username,
        amount: finalPrice,
        date: Timestamp.fromDate(startedAt),
        plan: plan.name,
        status: ""
      }

      // ----- create razorpay subscription for autopay
      // plan_TfvT1ZnurIb1rQ
      let subscriptionId;
      try {
        const data = await api.post("/subscription/create", {
          // planId: "plan_TfxopItQSqKgWJ"
          planId: plan.id
        })
        subscriptionId = data.data?.data.id;
      } catch (error) {
        console.error("Error creating subscription:", error);
      }

      if (!subscriptionId) {
        alert("Failed to create subscription. Please try again.");
        return;
      }


      // open razorpay checkout
      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        // amount: Math.round(finalPrice * 100),
        currency: "INR",
        name: "Chartr",
        description: `${plan.name} Plan`,
        prefill: {
          name: user.username,
          contact: user.phone,
        },
        theme: { color: "#7c3aed" },
        handler: async function (res: any) {


          try {
            // payment completed

            const expiresAt = subscriptionExpireAt(plan.name);

            const updateData: any = {
              plan: plan.name,
              purchaseAt: Timestamp.fromDate(startedAt),
              expireAt: Timestamp.fromDate(expiresAt),
            };

            if (hasReferral) {
              updateData.referredDevices = increment(-1);
            }

            const user = await updateDoc(userRef, updateData);
            console.log("User document updated:", user);

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
            navigate("/");
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

        // transaction history if transaction fails
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

      {referralAvailable > 0 && <div>
        <p>{referralAvailable * 150} will be refunded to your account </p>
      </div>
      }
      {
        plans.map((p: any) => {
          const finalPirce = getDiscountPirce(p.price, referralAvailable)
          return (
            <div key={p.name} className="card">
              <div className="pricing-block-content">
                <p className="pricing-plan capitalize">{p.name}</p>
                <div className="price-value">
                  <p className="price-number">

                    ₹
                    <span className="price-integer">
                      {finalPirce}
                    </span>
                  </p>
                </div>

                {referralAvailable > 0 && (
                  <p className="text-xs text-gray-900">
                    🎉 ₹{referralAvailable * 150} referral discount applied
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
                  onClick={() => handlePayment(p)}
                  className="bg-black text-white py-2 rounded-xl cursor-pointer w-full"
                >
                  Pay ₹{finalPirce}
                </button>

              </div>
            </div>
          );
        })
      }
    </div >
  );
};

export default ReNewPlan;


