import {StyleSheet} from "react-native";
import {colors} from "@/constants/colors";
import {cardShadow} from "@/assets/style/shared.styles";

export const styles = StyleSheet.create({
    selectorInput: {
        backgroundColor: colors.bg,
        borderRadius: 12,
        padding: 16,
        borderColor: colors.cardStroke,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...cardShadow,
    },
    selectorInputText: {
        fontSize: 18,
        color: colors.black,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 12,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardStroke,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.textMuted,
        borderRadius: 2,
        opacity: 0.3,
    },
    modalScroll: {
        paddingHorizontal: 16,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardStroke,
    },
    modalItemSelected: {
        backgroundColor: colors.bgDark,
        borderRadius: 12,
        marginVertical: 4,
        borderBottomWidth: 0,
    },
    modalItemText: {
        fontSize: 18,
        color: colors.black,
    },
    modalItemTextSelected: {
        fontWeight: '600',
        color: colors.black,
    }
});