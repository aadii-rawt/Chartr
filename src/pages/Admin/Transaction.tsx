import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type TransactionDoc = {
  id: string;
  username?: string;
  amount?: number;
  date?: any;
  plan?: string;
  status?: string;
};

const ROW_SIZES = [12, 25, 50] as const;

export default function Transaction() {
  const [transactions, setTransactions] = useState<TransactionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(1);

useEffect(() => {
  const load = async () => {
    try {
      const snap = await getDoc(
        doc(db, "transactions", "history")
      );

      console.log("SNAP EXISTS:", snap.exists());

      if (!snap.exists()) {
        console.log("Document not found");
        return;
      }

      const data = snap.data();

      setTransactions(data.passes || []);
    } catch (err) {
      console.error("ERROR:", err);
    }finally {
      setLoading(false)
    }
  };

  load();
}, []);
  // Search filter
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    if (!s) return transactions;

    return transactions.filter((t) => {
      return (
        (t.username || "")
          .toLowerCase()
          .includes(s) ||
        (t.plan || "")
          .toLowerCase()
          .includes(s) ||
        (t.status || "")
          .toLowerCase()
          .includes(s)
      );
    });
  }, [transactions, search]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / rowsPerPage)
  );

  const pageSafe = Math.min(page, totalPages);

  const start = (pageSafe - 1) * rowsPerPage;

  const pageRows = filtered.slice(
    start,
    start + rowsPerPage
  );

  return (
    <div className="min-h-screen text-zinc-200">
      <div className="mx-auto w-full max-w-7xl">

        {/* Search */}
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="w-80 rounded-lg bg-[#141519] border border-[#1E1F24] px-4 py-2 text-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1E1F24] bg-[#0E0F12]">

          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase text-zinc-400">
            <div className="col-span-3">Username</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">
              Date
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="p-6">
              Loading...
            </div>
          ) : pageRows.length === 0 ? (
            <div className="p-6">
              No transactions found.
            </div>
          ) : (
            <ul>
              {pageRows.map((t) => (
                <li
                  key={t.id}
                  className="grid grid-cols-12 items-center capitalize border-t text-sm border-[#15171B] px-6 py-4"
                >
                  <div className="col-span-3">
                    {t.username}
                  </div>

                  <div className="col-span-2">
                    {t.plan}
                  </div>

                  <div className="col-span-2">
                    ₹{t.amount}
                  </div>

                  <div className={ `  col-span-2`}>
                   <span className={`${t.status == "success" ? "bg-green-300/20 text-green-400" : "bg-red-300/20 text-red-400"} px-2 py-0.5 text-sm rounded-2xl`}> {t.status}</span>
                  </div>

                  <div className="col-span-3 text-right">
                    {t.date?.toDate
                      ? t.date
                          .toDate()
                          .toLocaleString()
                      : "-"}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#15171B] px-4 py-3">

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(
                  Number(e.target.value)
                );
                setPage(1);
              }}
              className="rounded-md bg-[#121317] border border-[#2A2D34] px-2 py-1"
            >
              {ROW_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div>
              Page {pageSafe} of {totalPages}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={pageSafe <= 1}
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                disabled={
                  pageSafe >= totalPages
                }
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