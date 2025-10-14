import {View, Text, Pressable, ScrollView, StyleProp, ViewStyle} from 'react-native'
import {useState} from 'react'
import {styles} from "@/assets/style/selector-input.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";

export interface SelectorItem {
    label: string;
    value: string;
}

interface SelectorInputProps {
    items: SelectorItem[];
    selectedItem: SelectorItem;
    onSelectItem: (item: SelectorItem) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
}

const SelectorInput = ({items, selectedItem, onSelectItem, placeholder, style}: SelectorInputProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleSelectItem = (item: SelectorItem) => {
        onSelectItem(item);
        setIsOpen(false);
    }

    return (
        <View style={style}>
            <Pressable style={styles.selectorInput} onPress={toggleDropdown}>
                <Text style={styles.selectorInputText}>
                    {placeholder ? placeholder : (typeof selectedItem === 'string' ? selectedItem : selectedItem.label)}
                </Text>
                <Ionicons name="chevron-down" size={24} color={colors.textMuted} />
            </Pressable>

            <ScrollView style={[styles.dropdown, { display: isOpen ? 'flex' : 'none' }]}>
                {
                    items.map((item) => (
                        <Pressable key={item.value} style={styles.dropdownItem} onPress={() => handleSelectItem(item)}>
                            <Text style={styles.dropdownItemText}>{item.label}</Text>
                        </Pressable>
                    ))
                }
            </ScrollView>
        </View>
    )
}
export default SelectorInput
