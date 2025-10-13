import {View, Text, Alert} from 'react-native'
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
import {LinearGradient} from "expo-linear-gradient";
import {useStats} from "@/stores/stats";

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
    const { addThrownAwayItems, updateAntiWasteScore, saveData } = useStats();

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
        .onStart(() => {
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
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={longPress}>
            <View style={styles.item}>
                <LinearGradient colors={colors.cardGradient} style={{ borderRadius: 12, padding: 14 }}>
                    <View style={styles.itemImg}></View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
                    </View>
                    <Text style={[styles.itemExpiration, {color: statusColors[itemStatus]}]}>
                        {lang.product.expiringIn} {formatDistanceToNow(new Date(item.expirationDate), {locale: fr})}
                    </Text>
                </LinearGradient>
            </View>
        </GestureDetector>
    )
}
export default Item
