import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    addItem: {
        backgroundColor: colors.bgDark,
        padding: 16
    },
    title: {
        fontSize: 32,
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "500",
        color: colors.textMuted
    },
    inputField: {
        marginBottom: 20
    },
    addBtn: {
        padding: 16,
        borderRadius: 12
    },
    addBtnText: {
        color: colors.bg,
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold"
    }
});