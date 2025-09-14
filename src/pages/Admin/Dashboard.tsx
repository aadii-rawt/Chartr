
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";

export default function Dashboard() {
  const cards = [
    {
      title: "Users",
      value: "8,912",
      delta: "+3.1%",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      title: "Orders",
      value: "1,284",
      delta: "+1.6%",
      icon: <FaShoppingCart className="w-5 h-5" />,
    },
    {
      title: "Revenue",
      value: "$24,120",
      delta: "+5.4%",
      icon: <FaDollarSign className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>

      {/* 3 Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-lg bg-[#111] text-white ring-1 ring-white/10 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{c.title}</span>
              <div className="p-2 rounded-md bg-white/10">{c.icon}</div>
            </div>
            <div className="mt-3 text-2xl font-semibold">{c.value}</div>
            <div className="mt-1 text-xs text-emerald-400">{c.delta} this week</div>

            {/* tiny trend bar */}
            <div className="mt-4 h-2 w-full bg-white/10 rounded">
              <div className="h-2 w-2/3 bg-white/40 rounded" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
