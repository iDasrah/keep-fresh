import {View, ActivityIndicator, Text, Alert} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import Item from "@/components/ui/Item";
import {styles} from "@/assets/style/items-list.styles";
import lang from "@/lib/lang";
import Animated, {useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useRouter} from "expo-router";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useLocation} from "@/hooks/useLocation";
import {useApiMutation} from "@/hooks/useApiMutation";
import {api} from "@/lib/api";
import {AxiosError} from "axios";
import {LocationProduct, Storage} from "@/types";

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
    storage?: Storage;
    searchText?: string;
}

const ItemsList = ({storage, searchText}: ItemsListProps) => {
    const router = useRouter();
    const { location } = useLocation();
    const [products, setProducts] = useState<LocationProduct[]>([]);

    const getLocationProductsV1 = useApiMutation(
        (data: string) => api.locationProduct.getLocationProductsV1(
            data,
            ['product',],
            'FULL',
            storage,
            searchText,
        )
    );

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
    useEffect(
        useCallback(() => {
            const fetchProducts = async () => {
                try {
                    if (!location) {
                        Alert.alert('Error', lang.errors.generic);
                        return;
                    }

                    const locationProducts = await getLocationProductsV1.mutateAsync(location);
                    setProducts(locationProducts.data);
                } catch (error: unknown) {
                    if (error instanceof AxiosError && error.response?.data?.message) {
                        Alert.alert('Error', error.response.data.message);
                        return;
                    }
                    Alert.alert('Error', lang.errors.generic);
                }
            }

            void fetchProducts();
        }, [])
    , [location, storage, searchText]);

    // ÉTAT 1 : Loading (requête en cours)
    if (getLocationProductsV1.isPending) {
        return <ActivityIndicator />
    }

    // ÉTAT 2 : Empty state (aucun item trouvé)
    if (products.length === 0) {
        return (
            <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsText}>{lang.noItems.title}</Text>
                {/* Bouton "Ajouter un produit" qui redirige vers /add-item */}
                <Animated.View style={animatedStyle}>
                    <AnimatedPressable onPress={() => router.push(`/(after-auth)/(app)/(tabs)/scan-product?storage=${storage}`)}>
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
            {products.map((item: LocationProduct) => (
                <Item key={item.id} item={item} />
            ))}
        </View>
    )
}

export default ItemsList;
