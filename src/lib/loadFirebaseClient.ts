type FirebaseClient = typeof import("@/lib/firebase");
type FirebaseClientLoadListener = (firebase: FirebaseClient) => void;

let firebaseClientPromise: Promise<FirebaseClient> | null = null;
const firebaseClientLoadListeners = new Set<FirebaseClientLoadListener>();

export function subscribeFirebaseClientLoads(listener: FirebaseClientLoadListener): () => void {
  firebaseClientLoadListeners.add(listener);
  return () => {
    firebaseClientLoadListeners.delete(listener);
  };
}

function notifyFirebaseClientLoad(firebase: FirebaseClient): void {
  for (const listener of firebaseClientLoadListeners) {
    try {
      listener(firebase);
    } catch (error: unknown) {
      console.error("Firebase client load listener error:", error);
    }
  }
}

export function loadFirebaseClient(): Promise<FirebaseClient> {
  if (!firebaseClientPromise) {
    firebaseClientPromise = import("@/lib/firebase")
      .then((firebase) => {
        notifyFirebaseClientLoad(firebase);
        return firebase;
      })
      .catch((error: unknown) => {
        firebaseClientPromise = null;
        throw error;
      });
  }

  return firebaseClientPromise;
}
