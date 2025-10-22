import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.cardStroke,
    },
    progressDotActive: {
        width: 32,
        backgroundColor: colors.black,
    },
    progressDotCompleted: {
        backgroundColor: colors.success,
    },
});
