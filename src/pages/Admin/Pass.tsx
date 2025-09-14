// src/pages/Pass.tsx
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  Timestamp,
  doc as fsDoc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { MdDeleteOutline } from "react-icons/md";

type PassItem = {
  id: string;              // "<docId>_<key>_<index>" or "<docId>_<key>"
  docId: string;           // parent Firestore doc id (uid)

  // Where to delete from:
  sourceKey?: string;      // array field name: "passes" | "pass" | ...
  sourceIndex?: number;    // index inside the array
  singleKey?: string;      // if stored as single object field at root

  // Data
  name?: string;
  phone?: string | number;
  dob?: string;
  idType?: string;
  last4Digits?: string;
  fare?: number;
  createdAt?: Timestamp | Date | string;
  validUntil?: Timestamp | Date | string;
  userImage?: string;
};

const PAGE_SIZES = [10, 25, 50] as const;

export default function Pass() {
  const [rows, setRows] = useState<PassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<PassItem | null>(null); // right sidebar

  // delete modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "passes"));
        const list: PassItem[] = [];

        snap.forEach((doc) => {
          const data = doc.data() as Record<string, unknown>;

          // 1) dedicated "pass" array
          const passArray = Array.isArray((data as any).pass)
            ? ((data as any).pass as any[])
            : null;
          if (passArray) {
            passArray.forEach((p, idx) => {
              if (p && typeof p === "object") {
                const o = p as any;
                list.push({
                  id: `${doc.id}_pass_${idx}`,
                  docId: doc.id,
                  sourceKey: "pass",
                  sourceIndex: idx,
                  name: o.name,
                  phone: o.phone,
                  dob: o.dob,
                  idType: o.idType,
                  last4Digits: o.last4Digits,
                  fare: o.fare,
                  createdAt: o.createdAt,
                  validUntil: o.validUntil,
                  userImage: o.userImage,
                });
              }
            });
          }

          // 2) scan all top-level keys (handles "passes" array and any other arrays)
          for (const [key, val] of Object.entries(data)) {
            if (key === "pass") continue; // already handled

            if (Array.isArray(val)) {
              val.forEach((p, idx) => {
                if (p && typeof p === "object") {
                  const o = p as any;
                  if ("name" in o || "phone" in o || "fare" in o) {
                    list.push({
                      id: `${doc.id}_${key}_${idx}`,
                      docId: doc.id,
                      sourceKey: key,         // array field name
                      sourceIndex: idx,       // index inside array
                      name: o.name,
                      phone: o.phone,
                      dob: o.dob,
                      idType: o.idType,
                      last4Digits: o.last4Digits,
                      fare: o.fare,
                      createdAt: o.createdAt,
                      validUntil: o.validUntil,
                      userImage: o.userImage,
                    });
                  }
                }
              });
            } else if (val && typeof val === "object") {
              // single object field at root
              const o = val as any;
              if ("name" in o || "phone" in o || "fare" in o) {
                list.push({
                  id: `${doc.id}_${key}`,
                  docId: doc.id,
                  singleKey: key,           // delete as field
                  name: o.name,
                  phone: o.phone,
                  dob: o.dob,
                  idType: o.idType,
                  last4Digits: o.last4Digits,
                  fare: o.fare,
                  createdAt: o.createdAt,
                  validUntil: o.validUntil,
                  userImage: o.userImage,
                });
              }
            }
          }
        });

        // newest first
        list.sort((a, b) => (toMs(b.createdAt) - toMs(a.createdAt)));
        setRows(list);
      } catch (e) {
        console.error("Failed to load passes:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;

  const pageRows = useMemo(
    () => rows.slice(start, start + pageSize),
    [rows, start, pageSize]
  );

  async function confirmDelete() {
    if (!selected) return;
    setDeleteErr(null);
    setShowConfirm(true);
  }

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    setDeleteErr(null);

    try {
      const dRef = fsDoc(db, "passes", selected.docId);
      const snap = await getDoc(dRef);
      if (!snap.exists()) throw new Error("Document not found");

      const data = snap.data() as any;

      if (selected.sourceKey != null && typeof selected.sourceIndex === "number") {
        // item inside an array field
        const arr: any[] = Array.isArray(data[selected.sourceKey])
          ? [...data[selected.sourceKey]]
          : [];
        if (selected.sourceIndex < 0 || selected.sourceIndex >= arr.length) {
          throw new Error("Item already removed");
        }
        arr.splice(selected.sourceIndex, 1);
        await updateDoc(dRef, { [selected.sourceKey]: arr });
      } else if (selected.singleKey) {
        // single object field at root
        await updateDoc(dRef, { [selected.singleKey]: deleteField() });
      } else {
        throw new Error("Unsupported pass shape");
      }

      // update UI
      setRows((prev) => prev.filter((r) => r.id !== selected.id));
      setSelected(null);
      setShowConfirm(false);
    } catch (err: any) {
      setDeleteErr(err?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="relative min-h-screen  text-zinc-200 ">
      <div className="mx-auto max-w-7xl">
        {/* header + page size */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Passes</h1>
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

        {/* table */}
        <div className="overflow-hidden rounded-2xl border border-[#1E1F24] bg-[#0E0F12]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#111216] text-zinc-400 text-xs uppercase">
                <tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Fare</Th>
                  <Th>Created</Th>
                  <Th className="pr-6">Valid Until</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-zinc-400">
                      Loading…
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-zinc-400">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-t text-sm border-[#15171B] hover:bg-white/5 cursor-pointer"
                      onClick={() => setSelected(r)}
                    >
                      <Td>{start + i + 1}</Td>
                      <Td className="font-medium">{r.name ?? "-"}</Td>
                      <Td>{r.phone ?? "-"}</Td>
                      <Td>{typeof r.fare === "number" ? r.fare : "-"}</Td>
                      <Td>{fmt(r.createdAt) ?? "-"}</Td>
                      <Td className="pr-6">{fmt(r.validUntil) ?? "-"}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* footer pager */}
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

      {/* Right sidebar (details) */}
      <aside
        className={`fixed z-40 top-0 right-0 h-full w-full max-w-md bg-[#0E0F12] border-l border-[#1E1F24] shadow-xl transition-transform duration-300 ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!selected}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1F24]">
          <h2 className="text-base font-semibold">Pass Details</h2>
          <div className="flex items-center gap-2">
            {selected && (
              <button
                onClick={confirmDelete}
                className="rounded-md cursor-pointer bg-rose-600 hover:bg-rose-700 px-3 py-2 text-sm"
              >
                <MdDeleteOutline size={18} />
              </button>
            )}
            <button
              onClick={() => setSelected(null)}
              className="rounded-md cursor-pointer bg-[#14161A] border border-[#2A2D34] px-3 py-1.5 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {selected && (
          <div className="p-5 space-y-4">
            {/* Image */}
            {selected.userImage ? (
              <img
                src={selected.userImage}
                alt={selected.name ?? "user"}
                className="w-full h-56 object-cover rounded-lg border border-[#1E1F24]"
              />
            ) : (
              <div className="w-full h-56 grid place-items-center rounded-lg border border-dashed border-[#2A2D34] text-zinc-500">
                No Image
              </div>
            )}

            <Detail label="Name" value={selected.name} />
            <Detail label="Phone" value={selected.phone} />
            <Detail label="Fare" value={selected.fare} />
            <Detail label="ID Type" value={selected.idType} />
            <Detail label="Last 4 Digits" value={selected.last4Digits} />
            <Detail label="DOB" value={selected.dob} />
            <Detail label="Created At" value={fmt(selected.createdAt)} />
            <Detail label="Valid Until" value={fmt(selected.validUntil)} />
          </div>
        )}
      </aside>

      {/* Confirm delete modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-[#0E0F12] border border-[#1E1F24] p-5">
            <h3 className="text-base font-semibold">Delete this pass?</h3>
            <p className="mt-1 text-sm text-zinc-400">
              This action cannot be undone.
            </p>
            {deleteErr && (
              <div className="mt-2 text-sm text-rose-400">{deleteErr}</div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md bg-[#14161A] border border-[#2A2D34] px-3 py-1.5 text-sm disabled:opacity-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-sm disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- minis ---------- */
function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={`px-6 py-3 text-left ${props.className ?? ""}`} />;
}
function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={`px-6 py-3 align-middle ${props.className ?? ""}`} />;
}
function Detail({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="text-sm">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-0.5 text-zinc-200">{value ?? "-"}</div>
    </div>
  );
}

/* ---------- helpers ---------- */
function toMs(d?: Timestamp | Date | string): number {
  if (!d) return 0;
  if (d instanceof Date) return d.getTime();
  if (typeof d === "string") {
    const x = new Date(d).getTime();
    return isNaN(x) ? 0 : x;
  }
  if (typeof (d as any).toDate === "function") return (d as any).toDate().getTime();
  return 0;
}
function fmt(d?: Timestamp | Date | string): string | undefined {
  const ms = toMs(d);
  if (!ms) return undefined;
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
