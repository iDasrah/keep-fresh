import {View, Text} from 'react-native'
import React from 'react'
import {Item as ItemType} from "@/types";
import {styles} from "@/assets/style/item.styles";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";
import lang from "@/lib/lang";
import {getItemStatus} from "@/lib/utils";
import {colors} from "@/constants/colors";

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

    return (
        <View style={styles.item}>
            <View style={styles.itemImg}></View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
            </View>
            <Text style={[styles.itemExpiration, {color: statusColors[itemStatus]}]}>
                {lang.product.expiringIn} {formatDistanceToNow(new Date(item.expirationDate), {locale: fr,},)}
            </Text>
        </View>
    )
}
export default Item
