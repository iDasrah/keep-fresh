import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        lineHeight: 24,
    },
    formContainer: {
        marginBottom: 32,
    },
    buttonsContainer: {
        gap: 12,
        marginTop: 'auto',
    },
    secondaryButton: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.cardStroke,
        backgroundColor: colors.bg,
    },
    secondaryButtonText: {
        color: colors.black,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
