import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";

export const styles = StyleSheet.create({
    selectorInput: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        padding: 16,
        borderColor: colors.cardStroke,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        maxHeight: 200,
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