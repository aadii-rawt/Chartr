// src/pages/Users.tsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";

type UserDoc = {
  id: string;          // Firestore doc id
  username?: string;
  email?: string;
  phone?: string | number;
  loginDevices?: number;
  plan?: string;
  uid?: string;        // Firebase Auth uid (if stored)
};

const ROW_SIZES = [12, 25, 50] as const;

export default function Users() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(ROW_SIZES[0]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      try {
        // Change "username" to "createdAt" if you store timestamps and want recent first.
        const q = query(collection(db, "users"), orderBy("username"));
        const snap = await getDocs(q);
        const data: UserDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserDoc, "id">) }));
        setUsers(data);
      } catch (e) {
        console.error("Failed to load users:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter (by username/email/phone) + paginate (client-side)
  const filtered = useMemo<UserDoc[]>(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => {
      const username = (u.username ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const phone = String(u.phone ?? "");
      return username.includes(s) || email.includes(s) || phone.includes(s);
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  const exportCSV = () => {
    const headers = ["Username", "Email", "Phone", "Login Devices", "Plan", "UID", "DocID"];
    const lines = [headers.join(",")];
    filtered.forEach((u) => {
      const row = [
        safeCSV(u.username),
        safeCSV(u.email),
        safeCSV(u.phone),
        safeCSV(u.loginDevices),
        safeCSV(u.plan),
        safeCSV(u.uid),
        safeCSV(u.id),
      ];
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-zinc-200 ">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-80">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full rounded-lg bg-[#141519] border border-[#1E1F24] px-10 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2A2D34]"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
              />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1E1F24] bg-[#0E0F12]">
          <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider text-zinc-400">
            <div className="col-span-4">Username</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2 text-right pr-4">Login Devices</div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-zinc-400">Loading users…</div>
          ) : pageRows.length === 0 ? (
            <div className="p-6 text-sm text-zinc-400">No users found.</div>
          ) : (
            <ul>
              {pageRows.map((u) => (
                <li
                  key={u.id}
                  className="grid grid-cols-12 items-center border-t border-[#15171B] px-6 py-4"
                >
                  <div className="col-span-4 text-sm">{u.username ?? "-"}</div>
                  <div className="col-span-4 text-sm text-zinc-300">{u.email ?? "-"}</div>
                  <div className="col-span-2 text-sm">{u.phone ?? "-"}</div>
                  <div className="col-span-2 text-right pr-4 text-sm">
                    {u.loginDevices ?? 0}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#15171B] px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Display lines per page</span>
              <select
                className="rounded-md bg-[#121317] border border-[#2A2D34] px-2 py-1 text-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setRowsPerPage(n);
                  setPage(1);
                }}
              >
                {ROW_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-zinc-400">
              Page {pageSafe} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="grid h-9 w-9 place-items-center rounded-md bg-[#14161A] border border-[#2A2D34] disabled:opacity-40"
                disabled={pageSafe <= 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="grid h-9 w-9 place-items-center rounded-md bg-[#14161A] border border-[#2A2D34] disabled:opacity-40"
                disabled={pageSafe >= totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** CSV cell sanitizer */
function safeCSV(v: unknown): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
