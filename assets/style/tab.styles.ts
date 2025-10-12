import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.bg,
        marginHorizontal: 64,
        borderRadius: 64,
        position: "fixed",
        bottom: 32,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tabBarItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        gap: 8,
    },
    tabBarItemText: {
        fontSize: 20,
        color: colors.bg,
    },
    activeBarItem: {
        backgroundColor: colors.black,
        borderRadius: 64
    },
});