import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    statCard: {
        flex: 1,
    },
    statCardContent: {
        alignItems: "center",
        justifyContent: "flex-start",
    },
    statCardValue: {
        fontSize: 32,
        fontWeight: "600",
        textAlign: "center",
    },
    statCardTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "500",
        marginTop: 4,
        minHeight: 48,
    },
    statCardSubtitle: {
        textAlign: "center",
        fontSize: 16,
        color: colors.textMuted,
        marginTop: 12,
        minHeight: 40,
    }
});