let firebaseClientPromise: Promise<typeof import("@/lib/firebase")> | null = null;

export function loadFirebaseClient(): Promise<typeof import("@/lib/firebase")> {
  if (!firebaseClientPromise) {
    firebaseClientPromise = import("@/lib/firebase").catch((error: unknown) => {
      firebaseClientPromise = null;
      throw error;
    });
  }

  return firebaseClientPromise;
}
