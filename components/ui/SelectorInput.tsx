import {View, Text, Pressable, ScrollView, StyleProp, ViewStyle, Modal, TouchableWithoutFeedback} from 'react-native'
import {useState} from 'react'
import {styles} from "@/assets/style/selector-input.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";

/**
 * COMPONENT : SelectorInput (sélecteur personnalisé avec modal)
 *
 * Alternative stylée au Picker natif. Affiche une modal bottom sheet animée
 * avec la liste des options.
 *
 * UTILISATION :
 * - Formulaire add-item/[productId] : Quantité, Unité, Stockage
 * - Permet de choisir parmi une liste d'options {label, value}
 *
 * ANIMATIONS :
 * - translateY : Modal slide depuis le bas (bottom sheet)
 * - opacity : Backdrop (fond noir transparent) fade in/out
 * - withSpring : Animation élastique fluide
 *
 * INTERACTION :
 * 1. Click sur le bouton → Ouvre la modal
 * 2. Click sur une option → Ferme la modal + callback onSelectItem
 * 3. Click sur le backdrop → Ferme la modal
 *
 * ACCESSIBILITÉ :
 * - Item sélectionné : Style différent + icône checkmark
 * - ScrollView si liste trop longue
 * - Handle visuel (barre) en haut de la modal pour indication de swipe
 */
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
    // État local de la modal (ouverte/fermée)
    const [isOpen, setIsOpen] = useState(false);

    // Valeurs animées Reanimated
    const translateY = useSharedValue(500); // Position Y de la modal (500 = hors écran en bas)
    const opacity = useSharedValue(0); // Opacité du backdrop

    /**
     * Toggle la modal avec animations.
     * OUVERTURE :
     * - setIsOpen(true) immédiatement (affiche la modal)
     * - translateY slide vers 0 (modal monte)
     * - opacity fade vers 1 (backdrop apparaît)
     *
     * FERMETURE :
     * - translateY slide vers 500 (modal descend)
     * - opacity fade vers 0 (backdrop disparaît)
     * - setTimeout 200ms avant setIsOpen(false) pour laisser l'animation finir
     */
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

    /**
     * Handler de sélection d'un item.
     * 1. Appelle le callback parent avec l'item sélectionné
     * 2. Ferme la modal
     */
    const handleSelectItem = (item: SelectorItem) => {
        onSelectItem(item);
        toggleModal();
    }

    // Style animé pour la modal (translateY contrôle la position verticale)
    const animatedModalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Style animé pour le backdrop (opacity contrôle la visibilité)
    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <>
            {/* BOUTON PRINCIPAL : Affiche la valeur sélectionnée + chevron */}
            <Pressable style={[styles.selectorInput, style]} onPress={toggleModal}>
                <Text style={styles.selectorInputText}>
                    {selectedItem ? selectedItem.label : (placeholder || 'Select an option')}
                </Text>
                <Ionicons name="chevron-down" size={24} color={colors.textMuted} />
            </Pressable>

            {/* MODAL : Bottom sheet avec liste des options */}
            <Modal
                visible={isOpen}
                transparent // Permet de voir à travers (pour le backdrop)
                animationType="none" // Gère l'animation manuellement avec Reanimated
                onRequestClose={toggleModal} // Android back button
            >
                <View style={styles.modalContainer}>
                    {/* BACKDROP : Fond noir transparent cliquable pour fermer */}
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
                    </TouchableWithoutFeedback>

                    {/* CONTENU DE LA MODAL : Bottom sheet animée */}
                    <Animated.View style={[styles.modalContent, animatedModalStyle]}>
                        {/* Handle visuel (petite barre) pour indiquer qu'on peut swiper */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                        </View>

                        {/* LISTE DES OPTIONS : ScrollView si liste longue */}
                        <ScrollView style={styles.modalScroll}>
                            {items.map((item) => (
                                <Pressable
                                    key={item.value}
                                    style={[
                                        styles.modalItem,
                                        // Style différent si item sélectionné
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
                                    {/* Icône checkmark si item sélectionné */}
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
