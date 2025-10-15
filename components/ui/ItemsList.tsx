import {View, ActivityIndicator, Text, Pressable} from 'react-native'
import React from 'react'
import {useDatabase} from "@/stores/database";
import {useQuery} from "@tanstack/react-query";
import Item from "@/components/ui/Item";
import {Item as ItemType} from "@/types";
import {styles} from "@/assets/style/items-list.styles";
import lang from "@/lib/lang";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useRouter} from "expo-router";
import AnimatedPressable from "@/components/ui/AnimatedPressable";

/**
 * COMPONENT : Liste des produits avec filtres
 *
 * Affiche tous les items filtrés par :
 * - Storage : frigo/congélateur/placards (optionnel)
 * - SearchText : recherche textuelle dans le nom (optionnel)
 *
 * TRI :
 * Les items sont triés par date d'expiration (plus proche = premier)
 * IMPORTANT : On crée une copie [...items] avant .sort() pour éviter
 * de muter le cache React Query (bug potentiel).
 *
 * ÉTATS D'AFFICHAGE :
 * - isLoading : ActivityIndicator (spinner)
 * - items vide : Empty state avec bouton "Ajouter un produit"
 * - items présents : Liste de composants <Item />
 *
 * REACT QUERY :
 * - queryKey dynamique selon storage et searchText
 * - enabled: isConnected (ne fetch pas si DB pas prête)
 * - Cache automatique des résultats
 */
interface ItemsListProps {
    storage?: "fridge" | "freezer" | "pantry";
    searchText?: string;
}

const ItemsList = ({storage, searchText}: ItemsListProps) => {
    const { searchItems, getAllItemsByStorage, getAllItems, isConnected } = useDatabase();
    const router = useRouter();

    // Shared value pour animation de scale (non utilisée actuellement mais disponible)
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    /**
     * useQuery : Récupère les items avec filtres.
     * La queryKey change selon storage/searchText, ce qui déclenche
     * un refetch automatique quand l'utilisateur change de filtre.
     *
     * queryFn : Logique de sélection intelligente :
     * - Si searchText : Recherche textuelle (avec ou sans storage)
     * - Si storage uniquement : Filtre par type de stockage
     * - Si aucun filtre : Récupère tous les items
     */
    const { data: items, isLoading } = useQuery({
        queryKey: ['items', storage, searchText],
        queryFn: async () => {
            if (searchText) return searchItems(searchText, storage);
            return storage ? getAllItemsByStorage(storage) : getAllItems();
        },
        enabled: isConnected // Ne lance pas la query si la DB n'est pas connectée
    });

    /**
     * TRI par date d'expiration (plus proche en premier).
     * IMPORTANT : [...items] crée une COPIE pour éviter de muter le cache React Query.
     * Sans copie, items?.sort() modifierait directement le cache et causerait des bugs.
     */
    const sortedItems = items ? [...items].sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()) : [];

    // ÉTAT 1 : Loading (requête en cours)
    if (isLoading) {
        return <ActivityIndicator />
    }

    // ÉTAT 2 : Empty state (aucun item trouvé)
    if (!sortedItems || sortedItems.length === 0) {
        return (
            <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsText}>{lang.noItems.title}</Text>
                {/* Bouton "Ajouter un produit" qui redirige vers /add-item */}
                <Animated.View style={animatedStyle}>
                    <AnimatedPressable onPress={() => router.push(`/add-item?storage=${storage}`)}>
                        <LinearGradient colors={colors.blackGradient} style={styles.addButton}>
                            <Text style={styles.addButtonText}>{lang.noItems.button}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </Animated.View>
            </View>
        )
    }

    // ÉTAT 3 : Affichage des items (liste normale)
    return (
        <View style={styles.itemsList}>
            {/* Map sur les items triés et render d'un composant Item pour chaque */}
            {sortedItems.map((item: ItemType) => (
                <Item key={item.id} item={item} />
            ))}
        </View>
    )
}
export default ItemsList
