// src/pages/DailyPass.tsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

type DailyPassItem = {
  id: string;                 // unique row id: "<uid>_<index>"
  uid: string;                // Firestore doc id (user uid)
  name?: string;
  phone?: string | number;
  age?: number;
  createdAt?: Timestamp | Date;
  validTill?: Timestamp | Date;
};

const PAGE_SIZES = [10, 50, 100] as const;

export default function AdminDailyPass() {
  const [rows, setRows] = useState<DailyPassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "dailyPass"));
        const all: DailyPassItem[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as { pass?: any[] };
          const list = Array.isArray(data?.pass) ? data.pass : [];
          list.forEach((p, idx) => {
            all.push({
              id: `${doc.id}_${idx}`,
              uid: doc.id,
              name: p?.name,
              phone: p?.phone,
              age: p?.age,
              createdAt: p?.createdAt,
              validTill: p?.validTill,
            });
          });
        });

        // Sort: latest createdAt on top
        all.sort((a, b) => {
          const ta = toDate(a.createdAt)?.getTime() ?? 0;
          const tb = toDate(b.createdAt)?.getTime() ?? 0;
          return tb - ta;
        });

        setRows(all);
      } catch (e) {
        console.error("Failed to load dailyPass:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const pageRows = useMemo(() => rows.slice(start, start + pageSize), [rows, start, pageSize]);

  return (
    <div className="min-h-screen  text-zinc-200 ">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Daily Pass</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
           
            <select
              className="rounded-md bg-[#121317] border border-[#2A2D34] px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#1E1F24] bg-[#0E0F12]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#111216] text-zinc-400 text-xs uppercase">
                <tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Age</Th>
                  <Th>Created At</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-zinc-400">
                      Loading…
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-zinc-400">
                      No passes found.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r, i) => (
                    <tr key={r.id} className="border-t border-[#15171B]">
                      <Td>{start + i + 1}</Td>
                      <Td className="font-medium">{r.name ?? "-"}</Td>
                      <Td>{r.phone ?? "-"}</Td>
                      <Td>{r.age ?? "-"}</Td>
                      <Td>{fmt(r.createdAt) ?? "-"}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between border-t border-[#15171B] px-4 py-3">
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

/* ---------- small helpers ---------- */
function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={`px-6 py-3 text-left ${props.className ?? ""}`} />;
}
function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={`px-6 py-4 align-middle ${props.className ?? ""}`} />;
}
function toDate(d?: Timestamp | Date): Date | undefined {
  if (!d) return undefined;
  if (d instanceof Date) return d;
  // Firestore Timestamp
  if (typeof (d as any).toDate === "function") return (d as any).toDate();
  return undefined;
}
function fmt(d?: Timestamp | Date): string | undefined {
  const x = toDate(d);
  if (!x) return undefined;
  return x.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
