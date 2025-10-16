import {create} from "zustand/react";

/**
 * Store Zustand pour gérer l'état de l'UI de la liste des produits.
 *
 * ÉTAT GÉRÉ :
 * - selectedStorage : Filtre de stockage actif (all/fridge/freezer/pantry)
 * - searchText : Texte de recherche actif
 *
 * UTILISATION :
 * - StorageSelector : Met à jour selectedStorage quand l'utilisateur clique sur un filtre
 * - Searchbar : Met à jour searchText quand l'utilisateur tape dans l'input
 * - ItemsList : Utilise ces valeurs pour construire la queryKey React Query et filtrer les items
 * - Header : Utilise selectedStorage pour le placeholder dynamique de la searchbar
 *
 * REACT QUERY INTEGRATION :
 * Ces valeurs font partie de la queryKey React Query :
 * queryKey: ['items', storage, searchText]
 * → Quand selectedStorage ou searchText change, React Query refetch automatiquement
 *
 * PAS DE PERSISTANCE :
 * Ce store n'est pas persisté (pas d'AsyncStorage).
 * L'état est reset à chaque redémarrage de l'app.
 */
interface ItemsState {
    selectedStorage: "all" | "fridge" | "freezer" | "pantry";
    searchText: string;

    setSelectedStorage: (storage: "all" | "fridge" | "freezer" | "pantry") => void;
    setSearchText: (text: string) => void;
}

export const useItems = create<ItemsState>((set, get) => ({
    // États initiaux
    selectedStorage: 'all', // Par défaut : Affiche tous les produits
    searchText: '', // Par défaut : Pas de recherche

    /**
     * Met à jour le filtre de stockage.
     * Appelé par StorageSelector quand l'utilisateur clique sur un lien.
     */
    setSelectedStorage: (storage) => set({selectedStorage: storage}),

    /**
     * Met à jour le texte de recherche.
     * Appelé par Searchbar à chaque changement de l'input (onChangeText).
     */
    setSearchText: (text) => set({searchText: text}),
}));