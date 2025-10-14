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

interface ItemProps {
    item: ItemType
}

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
    const { addThrownAwayItems } = useStats();
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const deleteItemMut = useMutation({
        mutationKey: ['deleteItem', item.id],
        mutationFn: async (id: number) => await deleteItem(id),
        onSuccess: () => {
            console.log("Item deleted", item.id);
            cancelItemNotifications(item.id);
            queryClient.refetchQueries({
                queryKey: ['items'],
                type: 'active'
            });
        }
    });

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
                        addThrownAwayItems();
                    }
                },
                {
                    text: lang.alert.consume,
                    onPress: () => {
                        deleteItemMut.mutate(item.id);
                    }
                }
            ]);
            await selectionAsync();
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
                    <View style={styles.itemImg}></View>
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
