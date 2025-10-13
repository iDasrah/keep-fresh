import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    antiWasteContainer: {
        borderRadius: 12,
        borderColor: colors.cardStroke,
        borderWidth: 1,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    antiWasteContent: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        borderRadius: 12
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
    }
});