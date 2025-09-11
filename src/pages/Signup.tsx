import React, { useState } from 'react'

const Signup = () => {
    const [form, setForm] = useState({ name: '', phone: '', message: '' });

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_W3FORM_kEY,
                    name: form.name,
                    phone: form.phone,
                    message: form.message,
                }),
            });

            const data = await response.json();
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error ❌");
        }
    };

    return (
        <div className="max-w-sm mx-auto min-h-screen p-4 bg-white rounded shadow space-y-4 flex items-center justify-center flex-col">
            <div className="card">
                <div className="pricing-block-content">
                    <p className="pricing-plan">Basic</p>
                    <div className="price-value" data-currency="$ USD" data-currency-simple="USD">
                        <p className="price-number">₹<span className="price-integer">100</span></p>
                        {/* <div id="priceDiscountCent">/month</div> */}
                    </div>
                    {/* <div className="pricing-note">For 1 month</div> */}
                    <ul className="check-list" role="list">
                        <li className="check-list-item">
                            ✔️  4 Free Daily Pass
                        </li>
                        <li className="check-list-item">
                            ❌   Free Monthly Pass
                        </li>
                        <li className="check-list-item">
                            ❌  Offline mode
                        </li>
                        <li className="check-list-item">
                            ❌  Daily Ticket
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card">
                <div className="pricing-block-content">
                    <p className="pricing-plan">Starter</p>
                    <div className="price-value" data-currency="$ USD" data-currency-simple="USD">
                        <p className="price-number">₹<span className="price-integer">250</span></p>
                        {/* <div id="priceDiscountCent">/month</div> */}
                    </div>
                    <div className="pricing-note">For 1 month</div>
                    <ul className="check-list" role="list">
                        <li className="check-list-item">
                            ✔️   Free Daily Pass
                        </li>
                        <li className="check-list-item">
                            ❌   Free Monthly Pass
                        </li>
                        <li className="check-list-item">
                            ❌  Offline mode
                        </li>
                        <li className="check-list-item">
                            ❌  Daily Ticket
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card">
                <div className="pricing-block-content">
                    <p className="pricing-plan">Gold</p>
                    <div className="price-value" data-currency="$ USD" data-currency-simple="USD">
                        <p className="price-number">₹<span className="price-integer">300</span></p>
                        {/* <div id="priceDiscountCent">/month</div> */}
                    </div>
                    <div className="pricing-note">For 1 month</div>
                    <ul className="check-list" role="list">
                        <li className="check-list-item">
                            ✔️   Free Daily Pass
                        </li>
                        <li className="check-list-item">
                            ✔️   Free Monthly Pass
                        </li>
                        <li className="check-list-item">
                            ❌  Offline mode
                        </li>
                        <li className="check-list-item">
                            ❌  Daily Ticket
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card">
                <div className="pricing-block-content">
                    <p className="pricing-plan">Premium</p>
                    <div className="price-value" data-currency="$ USD" data-currency-simple="USD">
                        <p className="price-number">₹<span className="price-integer">500</span></p>
                        {/* <div id="priceDiscountCent">/month</div> */}
                    </div>
                    <div className="pricing-note">For 2 month</div>
                    <ul className="check-list" role="list">
                        <li className="check-list-item">
                            ✔️   Free Daily Pass
                        </li>
                        <li className="check-list-item">
                            ✔️  Free Monthly Pass
                        </li>
                        <li className="check-list-item">
                            ✔️   Offline mode
                        </li>
                        <li className="check-list-item">
                            ❌  Daily Ticket
                        </li>
                    </ul>
                </div>
            </div>

            <form onSubmit={onSubmit} className="w-full mt-4 space-y-3">
                <div>
                    <label className="block text-sm mb-1">Your Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        type="text"
                        required
                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9\s+\-()]{7,}"
                        required
                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Message</label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        required
                        rows={4}
                        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Tell us what you need…"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-2 relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95"
                >
                    <span className="w-full h-full flex items-center justify-center gap-2 px-6 py-2 text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]">
                        Send Message
                    </span>
                </button>
            </form>

            {/* <div className='flex items-center justify-center flex-col'>
                <h1 className='text-center mt-3 font-medium'>Send message on this mail for demo and Purcase app</h1>
                <p className='text-center'>empirespear95@gmail.com</p>
                <a href="mailto:empirespear95@gmail.com"
                    className="relative cursor-pointer mt-5 opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95"
                >
                    <span
                        className="w-full h-full flex items-center gap-2 px-8 py-2 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]"
                    > Clik to send message
                    </span>
                </a>

            </div> */}
        </div>
    )
}

export default Signup