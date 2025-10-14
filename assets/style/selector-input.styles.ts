import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";
import {inputBase, cardShadow} from "@/assets/style/shared.styles";

export const styles = StyleSheet.create({
    selectorInput: {
        ...inputBase,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectorInputText: {
        fontSize: 18,
    },
    dropdown: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        marginTop: 8,
        borderColor: colors.cardStroke,
        borderWidth: 1,
        maxHeight: 200,
        ...cardShadow,
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardStroke,
    },
    dropdownItemText: {
        fontSize: 18,
    }
});