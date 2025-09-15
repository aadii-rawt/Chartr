"use client";
import { useState } from "react";
import { BsPass } from "react-icons/bs";
import { CiGrid42 } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuCrown, LuUsers } from "react-icons/lu";
import { FaHome } from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      section: "Main",
      links: [
        { href: "/admin", label: "Dashboard", icon: <CiGrid42  /> },
        { href: "/dailypassAdmin", label: "Daily Pass", icon: <BsPass  /> },
        { href: "/pass", label: "Pass", icon: <IoCalendarOutline   /> },
        { href: "/plans", label: "Plans", icon: <LuCrown  /> },
        { href: "/users", label: "Users", icon: <LuUsers  /> },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sticky min-h-screen inset-y-0 left-0 z-40 w-64 bg-black text-white border-r border-white/10
        transform transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo + Search */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <span className="font-bold text-2xl"><i>Chartr</i></span>
        </div>

        {/* Nav Sections */}
        <nav className="px-2 mt-5 space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              <ul className="space-y-1">
                {section.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/10 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 rounded-md"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <FaHome className="text-white w-6 h-6" />
      </button>
    </>
  );
}
