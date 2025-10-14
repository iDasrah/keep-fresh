import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    item: {
        width: 190,
    },
    itemContent: {
        padding: 14,
    },
    itemImg: {
        width: 160,
        height: 160,
        borderRadius: 12,
        backgroundColor: "#D9D9D9",
        marginBottom: 8
    },
    itemInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    itemQuantity: {
        fontSize: 14,
        color: colors.textMuted
    },
    itemExpiration: {
        marginTop: 8,
        fontSize: 14,
    }
});