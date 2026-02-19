import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type ProfileData, defaultData } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'profile-data';

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

    // 1. Fetch data from Supabase and subscribe to changes
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const { data: supabaseData } = await supabase
                    .from('profiles')
                    .select('content')
                    .eq('id', 1)
                    .single();

                if (isMounted && supabaseData && supabaseData.content) {
                    setData(supabaseData.content);
                }
            } catch (err) {
                console.error('Supabase fetch error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('profile-changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: 'id=eq.1' }, (payload) => {
                if (payload.new && payload.new.content && isMounted) {
                    setData(payload.new.content);
                }
            })
            .subscribe();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // 2. Sync to LocalStorage (as fallback)
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // 3. Update Function (Sync to Supabase)
    const updateData = async (newData: Partial<ProfileData>) => {
        setData(prev => {
            const updated = { ...prev, ...newData };

            // Sync to Supabase - using the latest merged data
            supabase
                .from('profiles')
                .upsert({ id: 1, content: updated })
                .then(({ error }) => {
                    if (error) console.error('Supabase sync error:', error);
                });

            return updated;
        });
    };

    const resetData = async () => {
        setData(defaultData);
        localStorage.removeItem(STORAGE_KEY);

        await supabase
            .from('profiles')
            .upsert({ id: 1, content: defaultData });
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
