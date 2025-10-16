import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    antiWasteContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    antiWasteTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8
    },
    antiWasteMsg: {
        flex: 1
    },
    antiWasteMsgTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4
    },
    antiWasteMsgContent: {
        fontSize: 14,
        color: colors.textMuted
    },
    statCardsContainer: {
        flexDirection: "row",
        gap: 16,
        justifyContent: "space-between"
    },
});