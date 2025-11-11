import {Alert, Text, View} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {styles} from "@/assets/style/item.styles";
import {formatDistanceToNow} from "date-fns";
import {fr, enGB} from "date-fns/locale";
import {getItemStatus} from "@/lib/utils";
import {colors} from "@/constants/colors";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Card from "@/components/ui/Card";
import {selectionAsync} from "expo-haptics";
import {LocationProduct} from "@/types";
import {useTranslation} from "react-i18next";
import {getLocales} from "expo-localization";

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
    item: LocationProduct
}

// Mapping des statuts vers les couleurs UI
const statusColors: Record<string, string> = {
    fresh: colors.success,
    expiringSoon: colors.warning,
    expired: colors.danger,
}

const Item = ({item}: ItemProps) => {
    const { t, ready } = useTranslation();
    const itemStatus = getItemStatus(new Date(item.expirationDate));
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));
    const locale = getLocales()[0]?.languageCode === 'en' ? enGB : fr;

    if (!ready) {
        return;
    }

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
            Alert.alert(t('alert.deleteItem'), t('alert.deleteItemMessage'), [
                {
                    text: t('alert.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('alert.throw'),
                    style: 'destructive',
                    onPress: () => {
                    }
                },
                {
                    text: t('alert.consume'),
                    onPress: () => {
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

    return (
        <GestureDetector gesture={longPress}>
            <Animated.View style={animatedStyle}>
                <Card style={styles.item} contentStyle={styles.itemContent}>
                    {
                        item.product?.images && item.product.images.length > 0 && (
                            <View>
                                <Animated.Image
                                    source={{uri: item.product.images[0].url}}
                                    style={styles.itemImg}
                                    resizeMode="cover"
                                />
                            </View>
                        )
                    }
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.product?.name}</Text>
                    </View>
                    {
                        item.quantity === 1 ? (
                            <Text style={styles.itemQuantity}>{item.product?.quantity} {item.product?.unit}</Text>
                        ) : (
                            <Text style={styles.itemQuantity}>{item.quantity} x {item.product?.quantity} {item.product?.unit}</Text>
                        )
                    }
                    <Text style={[styles.itemExpiration, {color: statusColors[itemStatus]}]}>
                        {t('product.expiringIn')} {formatDistanceToNow(new Date(item.expirationDate), {
                            includeSeconds: false,
                            locale,
                        })}
                    </Text>
                </Card>
            </Animated.View>
        </GestureDetector>
    )
}
export default Item
