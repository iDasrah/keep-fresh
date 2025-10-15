import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    addItemContainer: {
        backgroundColor: colors.bg,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    addItemInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 8,
    },
    addItemInput: {
        flex: 1,
        fontSize: 14,
        color: colors.black,
        paddingVertical: 8,
    },
    addItemButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        overflow: "hidden",
    },
    addItemButtonContent: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    addItemButtonText: {
        color: colors.bg,
        fontSize: 28,
        fontWeight: "600",
        lineHeight: 28,
    }
});