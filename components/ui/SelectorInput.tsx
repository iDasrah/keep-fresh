import {View, Text, Pressable, ScrollView} from 'react-native'
import {useState} from 'react'
import {styles} from "@/assets/style/selector-input.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";

interface SelectorInputProps {
    items: {label: string, value: string}[];
    selectedItem: {label: string, value: string};
    onSelectItem: (item: any) => void;
    placeholder?: string;
    style?: object;
}

const SelectorInput = ({items, selectedItem, onSelectItem, placeholder, style}: SelectorInputProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleSelectItem = (item: {label: string, value: string}) => {
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
