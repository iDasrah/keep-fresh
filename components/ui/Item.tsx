import {Alert, Text, View} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {Item as ItemType} from "@/types";
import {styles} from "@/assets/style/item.styles";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";
import lang from "@/lib/lang";
import {getItemStatus} from "@/lib/utils";
import {colors} from "@/constants/colors";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDatabase} from "@/stores/database";
import {useNotifications} from "@/stores/notifications";
import Card from "@/components/ui/Card";
import {useStats} from "@/stores/stats";
import {selectionAsync} from "expo-haptics";

/**
 * Composant Item - Affiche une carte de produit du frigo avec interaction longPress.
 *
 * FONCTIONNALITÉS :
 * - LongPress (1s) pour supprimer : affiche Alert avec 3 options
 *   1. "Annuler" - Ne fait rien
 *   2. "Jeter" - Supprime + incrémente stats thrownAwayItems
 *   3. "Consommer" - Supprime + calcule temps de consommation pour stats
 *
 * - Animation au press : scale 0.95 + opacity 0.8 pendant le longPress
 * - Feedback haptique sur déclenchement du longPress
 * - Couleur dynamique selon statut d'expiration (rouge/orange/vert)
 *
 * @param item - Produit à afficher (contient name, quantity, expirationDate, etc.)
 */
interface ItemProps {
    item: ItemType
}

// Mapping des statuts vers les couleurs UI
const statusColors: Record<string, string> = {
    fresh: colors.success,
    expiringSoon: colors.warning,
    expired: colors.danger,
}

const Item = ({item}: ItemProps) => {
    const itemStatus = getItemStatus(item.expirationDate);
    const { deleteItem } = useDatabase();
    const {cancelItemNotifications} = useNotifications();
    const queryClient = useQueryClient();
    const { addThrownAwayItems, addConsumptionTime } = useStats();
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const deleteItemMut = useMutation({
        mutationKey: ['deleteItem', item.id],
        mutationFn: async (id: number) => await deleteItem(id),
        onSuccess: () => {
            cancelItemNotifications(item.id);
            queryClient.refetchQueries({
                queryKey: ['items'],
                type: 'active'
            });
        }
    });

    /**
     * Gesture handler pour le LongPress.
     * - minDuration 1000ms pour éviter les triggers accidentels
     * - onBegin : démarre l'animation visuelle
     * - onStart : affiche l'Alert et joue le feedback haptique
     * - onFinalize : reset l'animation même si annulé
     * - runOnJS(true) : nécessaire pour Alert et async calls
     */
    const longPress = Gesture.LongPress()
        .minDuration(1000)
        .onBegin(() => {
            opacity.value = withTiming(.8, { duration: 200 });
            scale.value = withSpring(.95);
        })
        .onStart(async () => {
            Alert.alert(lang.alert.deleteItem, lang.alert.deleteItemMessage, [
                {
                    text: lang.alert.cancel,
                    style: 'cancel'
                },
                {
                    text: lang.alert.throw,
                    style: 'destructive',
                    onPress: () => {
                        deleteItemMut.mutate(item.id);
                        addThrownAwayItems(); // Impacte le score anti-gaspi
                    }
                },
                {
                    text: lang.alert.consume,
                    onPress: () => {
                        deleteItemMut.mutate(item.id);
                        // Calcul du temps de vie du produit pour stats
                        const time = Math.ceil((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                        addConsumptionTime(time);
                    }
                }
            ]);
            await selectionAsync(); // Vibration
        })
        .onFinalize(() => {
            opacity.value = withTiming(1, { duration: 200 });
            scale.value = withSpring(1);
        })
        .runOnJS(true);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));

    return (
        <GestureDetector gesture={longPress}>
            <Animated.View style={animatedStyle}>
                <Card style={styles.item} contentStyle={styles.itemContent}>
                    {/*<View style={styles.itemImg}></View>*/}
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
                    </View>
                    <Text style={[styles.itemExpiration, {color: statusColors[itemStatus]}]}>
                        {lang.product.expiringIn} {formatDistanceToNow(new Date(item.expirationDate), {locale: fr})}
                    </Text>
                </Card>
            </Animated.View>
        </GestureDetector>
    )
}
export default Item
