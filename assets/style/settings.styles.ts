import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    notificationsTitle: {
        fontSize: 24,
        fontWeight: "500",
        marginBottom: 16,
    },
    notificationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    notificationItemTitle: {
        fontSize: 18,
        marginBottom: 4,
    },
    notificationItemDesc: {
        fontSize: 14,
        color: colors.textMuted,
        maxWidth: '80%'
    },
    feedbackContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: "500",
    },
    deleteDataContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteDataTitle: {
        fontSize: 20,
        fontWeight: "500",
        color: colors.danger
    },
});