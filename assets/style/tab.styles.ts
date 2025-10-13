import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.bg,
        marginHorizontal: 48,
        borderRadius: 64,
        position: "absolute",
        bottom: 32,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tabBarItem: {
        gap: 8,
        padding: 20
    },
    tabBarItemText: {
        fontSize: 20,
        color: colors.bg,
    },
    activeBarItem: {
        borderRadius: 64,
        flexDirection: "row",
        alignItems: "center",
    },
});