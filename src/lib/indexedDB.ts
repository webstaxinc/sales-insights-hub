const DB_NAME = "SalesAnalyticsDB";
const DB_VERSION = 1;
const STORE_NAME = "salesData";

interface SalesDataStore {
  id: string;
  data: any[];
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export const saveSalesData = async (data: any[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    const dataToStore: SalesDataStore = {
      id: "currentData",
      data: data,
      timestamp: Date.now(),
    };

    const request = store.put(dataToStore);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getSalesData = async (): Promise<any[] | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("currentData");

    request.onsuccess = () => {
      const result = request.result as SalesDataStore | undefined;
      resolve(result ? result.data : null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearSalesData = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete("currentData");

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
