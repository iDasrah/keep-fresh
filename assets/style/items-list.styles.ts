import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    itemsList: {
        flexDirection: "row",
        gap: 16,
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    noItemsContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        paddingHorizontal: 32,
        minHeight: 500,
    },
    noItemsText: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        color: colors.textMuted,
        lineHeight: 28,
    },
    addButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 32,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        color: colors.bg,
        fontSize: 16,
        fontWeight: "600",
    }
});