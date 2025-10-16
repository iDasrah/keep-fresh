import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";
import {cardShadow} from "@/assets/style/shared.styles";

export const styles = StyleSheet.create({
    addItemContainer: {
        backgroundColor: colors.bg,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        gap: 12,
        borderColor: colors.cardStroke,
        borderWidth: 1,
        ...cardShadow
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
    },
    itemsList: {
        marginTop: 16,
        paddingBottom: 100,
    },
    itemCard: {
        marginBottom: 12,
    },
    itemCardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemText: {
        fontSize: 16,
        color: colors.black,
        fontWeight: "500",
        flex: 1,
    },
    itemActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 16,
    },
    emptyStateContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    emptyStateText: {
        color: colors.textMuted,
        fontSize: 16,
        marginTop: 16,
    }
});