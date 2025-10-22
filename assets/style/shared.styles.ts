import {StyleSheet, ViewStyle, TextStyle} from "react-native";
import {colors} from "@/constants/colors";

const shadowStyles = {
    shadowColor: colors.black,
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
};

export const cardShadow: ViewStyle = shadowStyles;

export const cardContainer: ViewStyle = {
    borderRadius: 12,
    borderColor: colors.cardStroke,
    borderWidth: 1,
    ...shadowStyles,
};

export const cardContent: ViewStyle = {
    padding: 16,
    borderRadius: 12,
};

export const inputBase: TextStyle = {
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 16,
    borderColor: colors.cardStroke,
    borderWidth: 1,
    ...shadowStyles,
};

export const sharedStyles = StyleSheet.create({
    label: {
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 6,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "500",
        marginBottom: 16,
    },
    form: {
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
    inputField: {
        marginBottom: 24,
    },
    button: {
        padding: 18,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: colors.bg,
        fontSize: 18,
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    link: {
        fontWeight: 'bold',
    },
});

export const ANIMATION_DURATION = 200;
export const PRESS_SCALE = 0.90;
