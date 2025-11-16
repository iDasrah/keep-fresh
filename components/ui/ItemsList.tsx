import {View, ActivityIndicator, Text, Alert, Dimensions} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import Item from "@/components/ui/Item";
import {styles} from "@/assets/style/items-list.styles";
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
import {useTranslation} from "react-i18next";
import {FlashList} from "@shopify/flash-list";

const ItemMemo = React.memo(Item);

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
    const { t, ready } = useTranslation(['common', 'error']);
    const router = useRouter();
    const { location } = useLocation();
    const [products, setProducts] = useState<LocationProduct[]>([]);
    const currentPageRef = useRef(0);
    const totalPagesRef = useRef(1);
    const isFetchingRef = useRef(false);
    const isFirstLoadRef = useRef(true);

    const getLocationProductsV1 = useApiMutation(
        ({ location, page }: { location: string, page: number }) => api.locationProduct.getLocationProductsV1(
            location,
            ['product',],
            'FULL',
            storage,
            searchText,
            page,
        )
    );

    // Shared value pour animation de scale (non utilisée actuellement mais disponible)
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const fetchProducts = async (resetList = false) => {
        try {
            if (isFetchingRef.current || currentPageRef.current >= totalPagesRef.current) {
                return;
            }

            if (!location) {
                Alert.alert('Error', t('generic', { ns: 'error' }));
                return;
            }

            isFetchingRef.current = true;
            const locationProducts = await getLocationProductsV1.mutateAsync({
                location,
                page: currentPageRef.current + 1,
            });
            if (locationProducts.headers['x-total-pages'] && !isNaN(locationProducts.headers['x-total-pages'])) {
                totalPagesRef.current = Number(locationProducts.headers['x-total-pages']);
            }
            if (locationProducts.headers['x-page'] && !isNaN(locationProducts.headers['x-page'])) {
                currentPageRef.current = Number(locationProducts.headers['x-page']);
            }

            if (resetList) {
                setProducts(locationProducts.data);
            } else {
                setProducts(products => [...products, ...locationProducts.data]);
            }
            isFetchingRef.current = false;
            isFirstLoadRef.current = false;
        } catch (error: unknown) {
            isFetchingRef.current = false;
            if (error instanceof AxiosError && error.response?.data?.message) {
                Alert.alert('Error', error.response.data.message);
                return;
            }
            Alert.alert('Error', t('generic', { ns: 'error' }));
        }
    }

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
    useEffect(() => {
            currentPageRef.current = 0;
            totalPagesRef.current = 1;
            isFirstLoadRef.current = true;

            void fetchProducts(true);
        }
    , [location, storage, searchText]);

    // ÉTAT 1 : Loading (requête en cours)
    if (isFirstLoadRef.current && (getLocationProductsV1.isPending || !ready)) {
        return <ActivityIndicator />
    }

    // ÉTAT 3 : Affichage des items (liste normale)
    return (
        <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width-32 }}>
            <FlashList
                data={products}
                renderItem={
                    ({item}: {item: LocationProduct}) => <ItemMemo item={item} />
                }
                onEndReached={fetchProducts}
                onEndReachedThreshold={0.5}
                onRefresh={() => {
                    currentPageRef.current = 0;
                    totalPagesRef.current = 1;
                    void fetchProducts(true);
                }}
                refreshing={isFetchingRef.current}
                ListFooterComponent={() => products.length > 0 && (
                    <View style={{ height: 400 }}>
                        <Text>{t('list.endOfList')}</Text>
                    </View>
                )}
                ListFooterComponentStyle={{
                    marginTop: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.noItemsContainer}>
                        <Text style={styles.noItemsText}>{t('noItems.title')}</Text>
                        <Animated.View style={animatedStyle}>
                            <AnimatedPressable onPress={() => router.push(`/(after-auth)/(app)/(tabs)/scan-product?storage=${storage}`)}>
                                <LinearGradient colors={colors.blackGradient} style={styles.addButton}>
                                    <Text style={styles.addButtonText}>{t('noItems.button')}</Text>
                                </LinearGradient>
                            </AnimatedPressable>
                        </Animated.View>
                    </View>
                }
            />
        </View>
    )
}

export default ItemsList;
