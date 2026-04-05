import React, { useEffect, useState } from "react";

const SignupwithRefer: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referral: "",
    password: "",
  });

  // Auto-fill referral
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, referral: ref }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save temp data
    localStorage.setItem("signupData", JSON.stringify(form));

    // Redirect to plan page
    window.location.href = "/select-plan";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md mx-auto p-4">

        <h1 className="text-2xl font-bold text-center mt-6">
          Create Account 🚍
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 mt-6 rounded-2xl shadow space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100"
            required
          />

          <input
            type="text"
            name="referral"
            placeholder="Referral Code"
            value={form.referral}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-100"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            Continue 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupwithRefer;