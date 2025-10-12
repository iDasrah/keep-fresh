import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    header: {
        zIndex: 10,
        backgroundColor: colors.black,
        paddingHorizontal: 16,
    },
    headerTitle: {
        display: "flex",
        flexDirection: "row",
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitleText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.bg
    }
});