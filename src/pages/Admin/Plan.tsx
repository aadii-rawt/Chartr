// src/pages/PlansTable.tsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

type Row = {
  id: string;
  username?: string;
  email?: string;
  phone?: string | number;
  plan?: string;
  purchaseAt?: Timestamp | Date;
  expireAt?: Timestamp | Date;
  dailyPurchased?: number;
  loginDevices?: number;
  uid?: string;
};

// helper to choose bg based on plan
function planBg(plan?: string): string {
  switch ((plan ?? "").toLowerCase()) {
    case "basic":
      return "bg-blue-600/20 text-blue-300 border-blue-600/40";
    case "starter":
      return "bg-green-600/20 text-green-300 border-green-600/40";
    case "gold":
      return "bg-yellow-600/20 text-yellow-300 border-yellow-600/40";
    case "premium":
      return "bg-purple-600/20 text-purple-300 border-purple-600/40";
    default:
      // treat as Admin (highest)
      return "bg-pink-600/20 text-pink-300 border-pink-600/40";
  }
}


const ROW_SIZES = [10, 50, 100] as const;

export default function PlansTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(ROW_SIZES[0]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        // Change to orderBy("purchaseAt","desc") if you prefer most recent first (ensure index).
        const q = query(collection(db, "users"), orderBy("username"));
        const snap = await getDocs(q);
        setRows(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Row, "id">) })));
      } catch (e) {
        console.error("Failed to load plans:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      (r.username ?? "").toLowerCase().includes(s) ||
      (r.email ?? "").toLowerCase().includes(s) ||
      String(r.phone ?? "").includes(s) ||
      (r.plan ?? "").toLowerCase().includes(s)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  const exportCSV = () => {
    const headers = [
      "Username", "Email", "Phone", "Plan", "Purchase At", "Expire At", "Status", "Days Left", "Daily Purchased", "UID", "DocID"
    ];
    const lines = [headers.join(",")];
    filtered.forEach(r => {
      lines.push([
        csv(r.username), csv(r.email), csv(r.phone), csv(r.plan),
        csv(fmt(r.purchaseAt)), csv(fmt(r.expireAt)),
        csv(isActive(r.expireAt) ? "Active" : "Expired"),
        csv(daysLeft(r.expireAt) ?? ""),
        csv(r.dailyPurchased), csv(r.uid), csv(r.id)
      ].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `plans_${dateStamp()}.csv` });
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen  text-zinc-200">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-80">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search user / email / phone / plan"
              className="w-full rounded-lg bg-[#141519] border border-[#1E1F24] px-10 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2A2D34]"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
            </svg>
          </div>
       
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1E1F24] bg-[#0E0F12]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#111216] text-zinc-400 text-xs uppercase">
                <tr>
                  <Th>Username</Th>
                  <Th>Phone</Th>
                  <Th>Plan</Th>
                  <Th>Purchase At</Th>
                  <Th>Expire At</Th>
                  <Th className="text-right">Status</Th>
                  <Th className="text-right pr-4">Days Left</Th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-6 py-6 text-zinc-400">Loading plans…</td></tr>
                ) : pageRows.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-6 text-zinc-400">No plans found.</td></tr>
                ) : (
                  pageRows.map(r => {
                    const active = isActive(r.expireAt);
                    return (
                      <tr key={r.id} className="border-t border-[#15171B]">
                        <Td>
                          <div className="font-medium">{r.username ?? "-"}</div>
                        </Td>
                        <Td>{r.phone ?? "-"}</Td>
                        <Td>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs border ${planBg(r.plan)}`}
                          >
                            {r.plan ?? "Admin"}
                          </span>
                          {typeof r.dailyPurchased === "number" && (
                            <span className="ml-2 text-[11px] text-zinc-500">/ {r.dailyPurchased}</span>
                          )}
                        </Td>

                        <Td>{fmt(r.purchaseAt) ?? "-"}</Td>
                        <Td>{fmt(r.expireAt) ?? "-"}</Td>
                        <Td className="text-right">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs ${active ? "bg-emerald-600/20 text-emerald-300" : "bg-red-600/20 text-red-300"}`}>
                            {active ? "Active" : "Expired"}
                          </span>
                        </Td>
                        <Td className="text-right pr-4">{daysLeft(r.expireAt) ?? "-"}</Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between border-t border-[#15171B] px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Display lines per page</span>
              <select
                className="rounded-md bg-[#121317] border border-[#2A2D34] px-2 py-1 text-sm"
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              >
                {ROW_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="text-sm text-zinc-400">Page {pageSafe} of {totalPages}</div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="grid h-9 w-9 place-items-center rounded-md bg-[#14161A] border border-[#2A2D34] disabled:opacity-40"
                disabled={pageSafe <= 1}
                aria-label="Previous page"
              >‹</button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="grid h-9 w-9 place-items-center rounded-md bg-[#14161A] border border-[#2A2D34] disabled:opacity-40"
                disabled={pageSafe >= totalPages}
                aria-label="Next page"
              >›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small helpers ---------- */
function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={`px-6 py-3 text-left ${props.className ?? ""}`} />;
}
function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={`px-6 py-4 align-middle ${props.className ?? ""}`} />;
}

function toDate(d?: Timestamp | Date): Date | undefined {
  if (!d) return undefined;
  if (d instanceof Date) return d;
  // @ts-ignore - Firestore Timestamp
  if (typeof (d as any).toDate === "function") return (d as any).toDate();
  return undefined;
}
function fmt(d?: Timestamp | Date): string | undefined {
  const x = toDate(d);
  if (!x) return undefined;
  return x.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function isActive(expireAt?: Timestamp | Date): boolean {
  const d = toDate(expireAt); if (!d) return false;
  return d.getTime() >= Date.now();
}
function daysLeft(expireAt?: Timestamp | Date): number | undefined {
  const d = toDate(expireAt); if (!d) return undefined;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
}
function csv(v: unknown): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
