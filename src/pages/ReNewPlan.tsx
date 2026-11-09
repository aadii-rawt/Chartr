
import React, { useEffect, useRef, useState } from "react";

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
  runTransaction,
} from "firebase/firestore";

import { db, auth } from "../../firebase";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import getReferal from "../utils/getReferal";
import { getDiscountPirce } from "../utils/utils";
import subscriptionExpireAt from "../utils/getExpireDate";

import api from "../api/axios";

const ReNewPlan = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [referralAvailable, setReferralAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "pending" | null
  >(null);

  const [paymentMessage, setPaymentMessage] = useState("");

  // Prevent duplicate payment processing during React re-renders.
  const processingRef = useRef(false);

  // Get referral count
  useEffect(() => {
    getReferal(user, setReferralAvailable, setLoading);
  }, [user]);

  // ----------------------------------------
  // INITIATE PAYU PAYMENT
  // ----------------------------------------

  const handlePayment = async (plan: any) => {
    try {
      if (!user?.uid) {
        alert("User not logged in");
        return;
      }

      const currentUser = user;

      if (!currentUser) {
        alert("Please login again");
        return;
      }


      setPaymentLoading(true);
      setPaymentStatus(null);
      setPaymentMessage("");

      // Get latest user data
      const userRef = doc(db, "users", user.uid);

      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        throw new Error("User not found");
      }

      const userData = snap.data();

      const hasReferral =
        Number(userData.referredDevices || 0) > 0;

      // Calculate discounted price
      const finalPrice = getDiscountPirce(
        plan.price,
        referralAvailable
      );

      if (finalPrice <= 0) {
        throw new Error("Invalid payment amount");
      }

      // Generate PayU payment request through backend
      const response = await api.post("/payu/initiate", {
        planName: plan.name,
        amount: finalPrice,
        userId: user.uid,
        username: user.username,
        email: "rawatadii060@gmail.com",
        phone: user.phone,
      });

      const { action, params, proof } = response.data;

      if (!action || !params || !proof) {
        throw new Error("Invalid PayU response");
      }

      // Save pending payment details
      const pendingPayment = {
        proof,
        planName: plan.name,
        amount: finalPrice,
        userId: user.uid,
        username: user.username,
        hasReferral,
        createdAt: Date.now(),
      };

      sessionStorage.setItem(
        "pendingPayUPayment",
        JSON.stringify(pendingPayment)
      );

      // Create PayU form
      const form = document.createElement("form");

      form.method = "POST";
      form.action = action;
      form.style.display = "none";

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");

        form.appendChild(input);
      });

      document.body.appendChild(form);

      // Open PayU checkout
      form.submit();

    } catch (error: any) {
      console.error("PayU initiation error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to initiate payment"
      );

      setPaymentLoading(false);
    }
  };

  // ----------------------------------------
  // HANDLE PAYU PAYMENT RESPONSE
  // SAME PRICING PAGE
  // ----------------------------------------

  useEffect(() => {
    console.log(user, "user in renew plan");
    const handlePaymentResponse = async () => {
      const txnid = searchParams.get("txnid");
      const payment = searchParams.get("payment");

      if (!txnid && !payment) return;

      if (processingRef.current) return;

      processingRef.current = true;

      try {
        setPaymentLoading(true);

        const saved = sessionStorage.getItem(
          "pendingPayUPayment"
        );

        if (!saved) {
          throw new Error("Payment session not found");
        }

        const pending = JSON.parse(saved);

        // Validate payment session
        if (
          Date.now() - pending.createdAt >
          30 * 60 * 1000
        ) {
          throw new Error("Payment session expired");
        }

        const currentUser = user;

        console.log("Current User:", currentUser, "Pending Payment:", pending);
        if (
          !currentUser ||
          currentUser.uid !== pending.userId
        ) {
          throw new Error("Please login with your original account");
        }

        if (!txnid) {
          throw new Error("Transaction ID missing");
        }

        // Verify payment with backend
        const response = await api.post(
          "/payu/verify",
          {
            txnid,
            proof: pending.proof,
          }
        );

        const paymentData = response.data;

        // Match payment with original request
        if (
          paymentData.userId !== currentUser.uid ||
          paymentData.planName !== pending.planName ||
          Number(paymentData.amount).toFixed(2) !==
          Number(pending.amount).toFixed(2)
        ) {
          throw new Error("Payment details mismatch");
        }

        // ----------------------------------------
        // PAYMENT FAILED
        // ----------------------------------------

        if (paymentData.status === "failed") {
          const historyRef = doc(
            db,
            "transactions",
            "history"
          );

          const failedData = {
            username: pending.username,
            amount: pending.amount,
            date: Timestamp.now(),
            plan: pending.planName,
            status: "failed",
            transactionId: txnid,
          };

          await setDoc(
            historyRef,
            {
              passes: arrayUnion(failedData),
            },
            { merge: true }
          );

          sessionStorage.removeItem("pendingPayUPayment");

          setPaymentStatus("failed");

          setPaymentMessage(
            "Payment failed. Please try again."
          );

          setPaymentLoading(false);

          setSearchParams({}, { replace: true });

          return;
        }

        // ----------------------------------------
        // PAYMENT PENDING
        // ----------------------------------------

        if (
          !paymentData.verified ||
          paymentData.status !== "success"
        ) {
          setPaymentStatus("pending");

          setPaymentMessage(
            "Your payment is being processed. Please try again shortly."
          );

          setPaymentLoading(false);

          setSearchParams({}, { replace: true });

          return;
        }

        // ----------------------------------------
        // PAYMENT SUCCESS
        // UPDATE FIREBASE
        // ----------------------------------------

        const userRef = doc(
          db,
          "users",
          currentUser.uid
        );

        const historyRef = doc(
          db,
          "transactions",
          "history"
        );

        // Unique transaction marker
        const processedRef = doc(
          db,
          "payu_processed",
          txnid
        );

        const startedAt = new Date();

        const expiresAt = subscriptionExpireAt(
          pending.planName
        );

        const transactionData = {
          username: pending.username,
          amount: Number(paymentData.amount),
          date: Timestamp.fromDate(startedAt),
          plan: pending.planName,
          status: "success",
          transactionId: txnid,
        };

        await runTransaction(db, async (transaction) => {
          // READ FIRST
          const processedSnap = await transaction.get(
            processedRef
          );

          if (processedSnap.exists()) {
            return;
          }

          const userSnap = await transaction.get(userRef);

          if (!userSnap.exists()) {
            throw new Error("User not found");
          }

          const historySnap = await transaction.get(
            historyRef
          );

          const userData = userSnap.data();

          const updateData: any = {
            plan: pending.planName,
            purchaseAt: Timestamp.fromDate(startedAt),
            expireAt: Timestamp.fromDate(expiresAt),
          };

          // Deduct referral only once
          if (pending.hasReferral) {
            if (
              Number(userData.referredDevices || 0) < 1
            ) {
              throw new Error(
                "Referral credit is no longer available"
              );
            }

            updateData.referredDevices = increment(-1);
          }

          // WRITE AFTER ALL READS
          transaction.update(userRef, updateData);

          if (historySnap.exists()) {
            transaction.update(historyRef, {
              passes: arrayUnion(transactionData),
            });
          } else {
            transaction.set(historyRef, {
              passes: [transactionData],
            });
          }

          transaction.set(processedRef, {
            txnid,
            status: "success",
            createdAt: Timestamp.now(),
          });
        });

        sessionStorage.removeItem("pendingPayUPayment");

        setPaymentStatus("success");

        setPaymentMessage(
          "Your subscription has been activated successfully!"
        );

        setPaymentLoading(false);

        setSearchParams({}, { replace: true });

        // Redirect to home after success
        setTimeout(() => {
          navigate("/");
        }, 2000);

      } catch (error: any) {
        console.error("Payment verification error:", error);

        setPaymentStatus("pending");

        setPaymentMessage(
          error.response?.data?.message ||
          error.message ||
          "Payment verification is pending. Please contact support if money was deducted."
        );

        setPaymentLoading(false);

        setSearchParams({}, { replace: true });

      } finally {
        processingRef.current = false;
      }
    };

    handlePaymentResponse();

  }, [searchParams, user]);

  // ----------------------------------------
  // LOADING
  // ----------------------------------------

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    );
  }

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div className="max-w-md mx-auto border flex items-center justify-center flex-col gap-5 py-5">

      {/* PAYMENT STATUS MESSAGE */}

      {paymentStatus && (
        <div
          className={`w-full p-4 rounded-xl text-center ${paymentStatus === "success"
              ? "bg-green-100 text-green-700"
              : paymentStatus === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          <p className="font-semibold">
            {paymentStatus === "success"
              ? "✅ Payment Successful"
              : paymentStatus === "failed"
                ? "❌ Payment Failed"
                : "⏳ Payment Pending"}
          </p>

          <p className="text-sm mt-1">
            {paymentMessage}
          </p>
        </div>
      )}

      {/* REFERRAL INFORMATION */}

      {referralAvailable > 0 && (
        <div>
          <p>
            ₹{referralAvailable * 150} will be refunded to your account
          </p>
        </div>
      )}

      {/* PLANS */}

      {plans.map((p: any) => {
        const finalPrice = getDiscountPirce(
          p.price,
          referralAvailable
        );

        return (
          <div key={p.name} className="card w-full">

            <div className="pricing-block-content">

              <p className="pricing-plan capitalize">
                {p.name}
              </p>

              <div className="price-value">
                <p className="price-number">
                  ₹
                  <span className="price-integer">
                    {finalPrice}
                  </span>
                </p>
              </div>

              {referralAvailable > 0 && (
                <p className="text-xs text-gray-900">
                  🎉 ₹{referralAvailable * 150} referral discount applied
                </p>
              )}

              <div className="pricing-note">
                {p.duration}
              </div>

              <ul className="check-list">
                {p.features.map((f: any, i: number) => (
                  <li
                    key={i}
                    className="check-list-item"
                  >
                    {f.available ? "✔️" : "❌"} {f.title}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(p)}
                disabled={paymentLoading}
                className="bg-black text-white py-2 rounded-xl cursor-pointer w-full disabled:opacity-50"
              >
                {paymentLoading
                  ? "Processing..."
                  : `Pay ₹${finalPrice}`}
              </button>

            </div>
          </div>
        );
      })}

    </div>
  );
};

export default ReNewPlan;
