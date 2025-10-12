import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    storageSelector: {
        display: "flex",
        flexDirection: "row",
        gap: 16,
        backgroundColor: colors.black,
        alignItems: "center"
    },
    storageSelectorLink: {
        paddingHorizontal: 4,
        color: colors.bg,
        fontSize: 18,
        paddingBottom: 6,
        borderBottomWidth: 2,
    },
    activeStorageSelectorLink: {
        borderBottomColor: colors.bg
    }
});