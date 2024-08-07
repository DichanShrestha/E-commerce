import {create} from 'zustand';

interface StoreState {
    store: string;
    storeId: string;
    setStore: (store: string) => void;
    setStoreId: (storeId: string) => void;
}

export const useUserStore = create<StoreState>()(set => ({
    store: '',
    storeId: '',
    setStore: (store: string) => set({store}),
    setStoreId: (storeId: string) => set({storeId})
}))