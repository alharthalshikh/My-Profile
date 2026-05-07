import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type ProfileData, defaultData } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const STORAGE_KEY = 'profile-data';
const FIREBASE_DOC_PATH = { collection: 'settings', id: 'profile' };

interface DataContextType {
    data: ProfileData;
    updateData: (newData: Partial<ProfileData>) => void;
    resetData: () => void;
    exportData: () => string;
    importData: (json: string) => boolean;
    incrementClients: () => void;
    loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ProfileData>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    ...defaultData,
                    ...parsed,
                    contact: { ...defaultData.contact, ...(parsed.contact || {}) },
                    extraTitles: parsed.extraTitles || defaultData.extraTitles
                };
            }
        } catch { /* ignore */ }
        return defaultData;
    });

    // 1. Fetch data from Firebase and subscribe to changes
    useEffect(() => {
        let isMounted = true;
        const docRef = doc(db, FIREBASE_DOC_PATH.collection, FIREBASE_DOC_PATH.id);

        // Initial Fetch
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (isMounted && docSnap.exists()) {
                    setData(docSnap.data() as ProfileData);
                }
            } catch (err) {
                console.error('Firebase fetch error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        // Subscribe to real-time changes
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (isMounted && docSnap.exists()) {
                setData(docSnap.data() as ProfileData);
            }
        }, (err) => {
            console.error('Firebase snapshot error:', err);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // 2. Sync to LocalStorage (as fallback)
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // 3. Update Function (Sync to Firebase)
    const updateData = async (newData: Partial<ProfileData>) => {
        setData(prev => {
            const updated = { ...prev, ...newData };
            const docRef = doc(db, FIREBASE_DOC_PATH.collection, FIREBASE_DOC_PATH.id);

            // Sync to Firebase
            setDoc(docRef, updated, { merge: true })
                .catch((error) => {
                    console.error('Firebase sync error:', error);
                });

            return updated;
        });
    };

    const resetData = async () => {
        setData(defaultData);
        localStorage.removeItem(STORAGE_KEY);

        const docRef = doc(db, FIREBASE_DOC_PATH.collection, FIREBASE_DOC_PATH.id);
        await setDoc(docRef, defaultData);
    };

    const exportData = () => JSON.stringify(data, null, 2);

    const importData = (json: string): boolean => {
        try {
            const parsed = JSON.parse(json);
            updateData(parsed);
            return true;
        } catch {
            return false;
        }
    };

    const incrementClients = () => {
        const newCount = data.clients + 1;
        updateData({ clients: newCount });
    };

    return (
        <DataContext.Provider value={{ data, updateData, resetData, exportData, importData, incrementClients, loading }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
}
