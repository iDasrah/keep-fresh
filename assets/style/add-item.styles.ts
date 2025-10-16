import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    addItem: {
        backgroundColor: colors.bgDark,
        padding: 24,
        minHeight: "100%",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "400",
        color: colors.textMuted,
        lineHeight: 24,
    },
    inputField: {
        marginBottom: 24,
    },
    addBtn: {
        padding: 18,
        borderRadius: 16,
        marginTop: 12,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    addBtnText: {
        color: colors.bg,
        fontSize: 18,
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    androidDatePicker: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.cardStroke,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    androidDatePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    androidDatePickerText: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
    },
});