import {StyleSheet, ViewStyle, TextStyle} from "react-native";
import {colors} from "@/constants/colors";

// Shadow type that works for both View and Text styles
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

export const styles = StyleSheet.create({
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
});

export const ANIMATION_DURATION = 200;
export const PRESS_SCALE = 0.90;
