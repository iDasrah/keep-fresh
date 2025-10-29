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
    methodsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.cardStroke,
        gap: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.bgDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodContent: {
        flex: 1,
    },
    methodTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 4,
    },
    methodDescription: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 15,
        color: colors.textMuted,
    },
    footerLink: {
        fontSize: 15,
        color: colors.black,
        fontWeight: '600',
    },
});
