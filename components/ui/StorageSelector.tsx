import {View} from 'react-native'
import React, {useEffect} from 'react'
import {styles} from "@/assets/style/storage-selector.styles";
import {Link, useLocalSearchParams} from "expo-router";
import lang from "@/lib/lang";
import {useItems} from "@/stores/items";

/**
 * COMPONENT : StorageSelector (sélecteur de type de stockage)
 *
 * Barre horizontale avec 4 liens pour filtrer les items par stockage :
 * - Tous (pas de filtre)
 * - Frigo
 * - Congélateur
 * - Placards
 *
 * FONCTIONNEMENT :
 * - Utilise <Link> d'Expo Router pour la navigation
 * - Query param ?storage=... pour filtrer (ex: /?storage=fridge)
 * - useEffect synchronise l'état global Zustand avec le query param
 * - Style actif (activeStorageSelectorLink) appliqué au lien sélectionné
 *
 * NAVIGATION :
 * Les liens changent l'URL, ce qui déclenche :
 * 1. Re-render de StorageSelector (nouveau storage param)
 * 2. useEffect met à jour selectedStorage dans le store
 * 3. ItemsList détecte le changement via React Query et refetch
 *
 * VALIDATION :
 * useEffect vérifie que storage est valide avant de l'appliquer.
 */
const StorageSelector = () => {
    // Query param actuel (?storage=fridge, ?storage=freezer, etc.)
    const {storage} = useLocalSearchParams();
    const {setSelectedStorage} = useItems();

    /**
     * Synchronise l'état global avec le query param.
     * - Si storage est undefined (URL = "/") → selectedStorage = "all"
     * - Si storage est valide (fridge/freezer/pantry) → selectedStorage = storage
     * - Sinon : ignore (protection contre valeurs invalides)
     */
    useEffect(() => {
        if (storage === undefined || storage === "fridge" || storage === "freezer" || storage === "pantry") {
            setSelectedStorage(storage === undefined ? "all" : storage);
        }
    }, [setSelectedStorage, storage]);

    return (
        <View style={styles.storageSelector}>
            {/* LIEN 1 : Tous (pas de query param) */}
            <Link
                href="/"
                style={[
                    styles.storageSelectorLink,
                    storage === undefined && styles.activeStorageSelectorLink
                ]}
            >
                {lang.header.storageSelector.all}
            </Link>

            {/* LIEN 2 : Frigo (?storage=fridge) */}
            <Link
                href="/?storage=fridge"
                style={[
                    styles.storageSelectorLink,
                    storage === "fridge" && styles.activeStorageSelectorLink
                ]}
            >
                {lang.header.storageSelector.fridge}
            </Link>

            {/* LIEN 3 : Congélateur (?storage=freezer) */}
            <Link
                href="/?storage=freezer"
                style={[
                    styles.storageSelectorLink,
                    storage === "freezer" && styles.activeStorageSelectorLink
                ]}
            >
                {lang.header.storageSelector.freezer}
            </Link>

            {/* LIEN 4 : Placards (?storage=pantry) */}
            <Link
                href="/?storage=pantry"
                style={[
                    styles.storageSelectorLink,
                    storage === "pantry" && styles.activeStorageSelectorLink
                ]}
            >
                {lang.header.storageSelector.pantry}
            </Link>
        </View>
    )
}
export default StorageSelector
