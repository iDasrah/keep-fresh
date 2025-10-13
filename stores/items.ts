import {create} from "zustand/react";

interface ItemsState {
    selectedStorage: "all" | "fridge" | "freezer" | "pantry";
    searchText: string;

    setSelectedStorage: (storage: "all" | "fridge" | "freezer" | "pantry") => void;
    setSearchText: (text: string) => void;
}

export const useItems = create<ItemsState>((set, get) => ({
    selectedStorage: 'all',
    searchText: '',

    setSelectedStorage: (storage) => set({selectedStorage: storage}),
    setSearchText: (text) => set({searchText: text}),
}));