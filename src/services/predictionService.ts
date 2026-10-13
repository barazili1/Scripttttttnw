export const TARGET_FIREBASE_ID = "1829018123";
export const FIREBASE_ENDPOINT =
  "https://scriptnew-121e3-default-rtdb.firebaseio.com/pre/hipr/hipr.json";
export const SITE_LOGO_URL =
  "https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg";

export async function fetchFirebaseMultiplier(): Promise<number | null> {
  try {
    const res = await fetch(FIREBASE_ENDPOINT, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = typeof data === "number" ? data : parseFloat(String(data));
    return isNaN(parsed) ? null : parsed;
  } catch (err) {
    console.warn("Firebase fetch error:", err);
    return null;
  }
}

export function isSpecialFirebaseUser(id?: string): boolean {
  if (!id) return false;
  return id.trim() === TARGET_FIREBASE_ID;
}
