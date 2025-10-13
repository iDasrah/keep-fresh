import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    notificationsContainer: {
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
    notificationsContent: {
        padding: 16,
        borderRadius: 12,
    },
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
    feedbackContainer: {
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
    feedbackContent: {
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: "500",
    },
    deleteDataContainer: {
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
    deleteDataContent: {
        padding: 16,
        borderRadius: 12,
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