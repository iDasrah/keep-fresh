import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    svg: {
        position: 'absolute',
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 32,
        color: colors.success,
        fontWeight: 'bold',
    }
});