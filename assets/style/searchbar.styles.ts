import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    searchbar: {
        backgroundColor: colors.bg,
        borderRadius: 64,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 24
    }
});