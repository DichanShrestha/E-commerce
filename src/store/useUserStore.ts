import {create} from 'zustand';

interface StoreState {
    store: string;
    setStore: (store: string) => void;
}

export const useUserStore = create<StoreState>()(set => ({
    store: '',
    setStore: (store: string) => set({store})
}))