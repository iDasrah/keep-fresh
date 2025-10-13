import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    item: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        padding: 14,
        width: 190,
        borderColor: colors.cardStroke,
        borderWidth: 1,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 2
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