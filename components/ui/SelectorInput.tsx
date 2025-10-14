import {View, Text, Pressable, ScrollView, StyleProp, ViewStyle, Modal, TouchableWithoutFeedback} from 'react-native'
import {useState} from 'react'
import {styles} from "@/assets/style/selector-input.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";

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
    const translateY = useSharedValue(500);
    const opacity = useSharedValue(0);

    const toggleModal = () => {
        if (!isOpen) {
            setIsOpen(true);
            translateY.value = withSpring(0);
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            translateY.value = withSpring(500, {
                damping: 20,
                stiffness: 300,
            });
            opacity.value = withTiming(0, { duration: 200 });
            setTimeout(() => setIsOpen(false), 200);
        }
    }

    const handleSelectItem = (item: SelectorItem) => {
        onSelectItem(item);
        toggleModal();
    }

    const animatedModalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <>
            <Pressable style={[styles.selectorInput, style]} onPress={toggleModal}>
                <Text style={styles.selectorInputText}>
                    {selectedItem ? selectedItem.label : (placeholder || 'Select an option')}
                </Text>
                <Ionicons name="chevron-down" size={24} color={colors.textMuted} />
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
                    </TouchableWithoutFeedback>

                    <Animated.View style={[styles.modalContent, animatedModalStyle]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            {items.map((item) => (
                                <Pressable
                                    key={item.value}
                                    style={[
                                        styles.modalItem,
                                        item.value === selectedItem.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => handleSelectItem(item)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        item.value === selectedItem.value && styles.modalItemTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {item.value === selectedItem.value && (
                                        <Ionicons name="checkmark" size={24} color={colors.black} />
                                    )}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </>
    )
}
export default SelectorInput
