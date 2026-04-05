import React, { useEffect } from "react";
import { plans } from "../config/plans";
import { collection, doc, getDoc, getDocs, increment, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";



declare global {
    interface Window {
        Razorpay?: any;
    }
}

const DISCOUNT = 150;

const SelectPlan = () => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string;
    const { setUser } = useUser()
    const signupData = JSON.parse(localStorage.getItem("signupData") || "{}");
    const navigate = useNavigate()

    // Load Razorpay
    useEffect(() => {
        if (window.Razorpay) return;

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // Expiry logic (same as yours)
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

            const finalPrice = Math.max(plan.price - DISCOUNT, 1);

            const options = {
                key: keyId,
                amount: Math.round(finalPrice * 100),
                currency: "INR",
                name: "Chartr",
                description: `${plan.name} Plan`,

                prefill: {
                    name: signupData.name,
                    contact: signupData.phone,
                },

                theme: { color: "#7c3aed" },

                handler: async function () {
                    try {
                        // 🔥 1. CREATE AUTH USER
                        const userCredential = await createUserWithEmailAndPassword(
                            auth,
                            signupData.email,
                            signupData.password
                        );

                        const firebaseUser = userCredential.user;
                        const uid = firebaseUser.uid;

                        // 🔥 2. PLAN DATES
                        const startedAt = new Date();
                        const expiresAt = getExpiryDatePlusOneMonth(plan.name);
                        const userData = {
                            uid,
                            username: signupData.name,
                            email: signupData.email,
                            phone: signupData.phone,
                            password:  signupData.password,
                            referral: signupData.referral || null,

                            plan: plan.name,
                            pricePaid: finalPrice,

                            loginDevices: 1,
                            referredDevices: 0,

                            purchaseAt: Timestamp.fromDate(startedAt),
                            expireAt: Timestamp.fromDate(expiresAt),
                        };

                        await setDoc(doc(db, "users", uid), userData);

                        if (signupData.referral) {
                            try {
                                const q = query(
                                    collection(db, "users"),
                                    where("phone", "==", signupData.referral)
                                );
                                console.log("helloe", q);

                                const querySnapshot = await getDocs(q);

                                if (!querySnapshot.empty) {
                                    const refUserDoc = querySnapshot.docs[0];
                                    console.log(refUserDoc);

                                    await updateDoc(refUserDoc.ref, {
                                        referredDevices: increment(1),
                                    });
                                }
                            } catch (err) {
                                console.log("Referral update failed", err);
                            }
                        }else {
                            console.log("no refer");
                            
                        }


                        // 🔥 5. SAVE USER IN LOCAL STORAGE
                        localStorage.setItem("user", JSON.stringify(userData));

                        // 🔥 6. CLEANUP
                        localStorage.removeItem("signupData");

                        alert("✅ Account created & plan activated!");

                        window.location.href = "/";

                    } catch (err: any) {
                        console.error(err);

                        if (err.code === "auth/email-already-in-use") {
                            alert("⚠️ Email already exists. Please login.");
                        } else if (err.code === "auth/weak-password") {
                            alert("⚠️ Password should be at least 6 characters.");
                        } else {
                            alert("User creation failed after payment.");
                        }
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
            {plans.map((p: any) => {
                const discountedPrice = Math.max(p.price - DISCOUNT, 1);

                return (
                    <div key={p.name} className="card">
                        <div className="pricing-block-content">

                            <p className="pricing-plan capitalize">{p.name}</p>

                            {/* PRICE UI (UPDATED ONLY THIS PART) */}
                            <div className="price-value">
                                <p className="price-number">
                                    <span className="line-through text-gray-400 mr-2 text-sm">
                                        ₹{p.price}
                                    </span>
                                    ₹
                                    <span className="price-integer">
                                        {discountedPrice}
                                    </span>
                                </p>
                            </div>

                            <p className="text-xs text-green-500">
                                🎉 ₹150 referral discount applied
                            </p>

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

export default SelectPlan;