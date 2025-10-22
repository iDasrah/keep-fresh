import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    container: {
        flex: 1,
        padding: 24,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.black,
    },
    titleBrand: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.black,
    },
    titleAccent: {
        color: colors.success,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textMuted,
        lineHeight: 26,
        marginTop: 8,
    },
    actions: {
        gap: 16,
        marginTop: 'auto',
        paddingBottom: 16,
    },
});