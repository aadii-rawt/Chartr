
export default function validateRolePurchase(role, user) {
  switch (role) {
    case "basic": {
      const DAILY_LIMIT = 5;
      if (user.dailyPurchased >= DAILY_LIMIT) {
        return { ok: false, reason: `Basic plan limit reached (max ${DAILY_LIMIT} per day).` };
      }
      return { ok: true };
    }
    // No limits for these roles (unlimited by default)
    case "standard":
    case "gold":
    case "premium":
      return { ok: true };

    // Fallback: treat unknown roles as unlimited (or change to deny if you prefer)
    default:
      return { ok: true };
  }
}

// Helper: accept Firestore Timestamp, plain object {seconds, nanoseconds}, or Date/string
function tsToDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate(); // Firestore Timestamp
  if (typeof ts.seconds === "number") {
    const ms = ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6);
    return new Date(ms);
  }
  return new Date(ts); // ISO string or Date
}

// Normalize a JS Date to local midnight (date-only)
function atLocalMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export const checkPlan = (plan, user) => {
  const todayLocal = atLocalMidnight(new Date());
  const expireRaw = tsToDate(user?.expireAt);           // converts {seconds,nanoseconds} -> Date
  const expireLocal = expireRaw ? atLocalMidnight(expireRaw) : null;

  switch (plan) {
    case "basic": {
      if (user?.dailyPurchased >= 5) {
        return {
          ok: false,
          message:
            "Your Basic plan limit has been reached. To get more tickets, please renew your plan.",
        };
      }
      return { ok: true };
    }

    case "starter":
    case "gold":
    case "premium": {
      if (!expireLocal) {
        return { ok: true, message: "No expiry date found for this plan." };
      }
      if (expireLocal < todayLocal) {
        return {
          ok: false,
          message:
            "Your plan has expired. To get more tickets, please renew your plan.",
        };
      }
      return { ok: true };
    }

    default:
      return { ok: true };
  }
};
