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
        fontWeight: "medium",
        color: colors.textMuted
    },
    label: {
        fontSize: 20,
        fontWeight: "medium",
        marginBottom: 6,
        marginLeft: 4
    },
    textInput: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        borderColor: colors.cardStroke,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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