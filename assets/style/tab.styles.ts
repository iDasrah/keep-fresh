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
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 8,
    },
    tabBarItem: {
        paddingVertical: 16,
        paddingHorizontal: 6,
    },
    tabBarItemText: {
        fontSize: 16,
        color: colors.bg,
    },
    activeBarItem: {
        borderRadius: 64,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    activeBackground: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 120,
        zIndex: 0,
    },
    tabTrigger: {
        paddingHorizontal: 16,
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
    }
});