import {View, Text} from 'react-native'
import React, {memo, useCallback} from 'react'
import {styles} from "@/assets/style/header.styles";
import { colors } from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import Searchbar from "./Searchbar";
import StorageSelector from "@/components/ui/StorageSelector";
import { useRouter } from "expo-router";
import AnimatedPressable from "./AnimatedPressable";
import {useItems} from "@/stores/items";

/**
 * Props du composant Header
 *
 * - variant : détermine le type d'en-tête ('index' pour l'accueil, 'back' pour les pages secondaires)
 */
interface HeaderProps {
    variant?: 'index' | 'back';
}

/**
 * Composant Header
 *
 * Affiche l'en-tête de l'application avec le titre, les boutons d'action et les composants de recherche/sélection.
 * Utilise React.memo pour optimiser les performances et éviter les rendus inutiles.
 *
 * - Si variant = 'back' : affiche le bouton retour
 * - Si variant = 'index' : affiche le bouton d'ajout, la barre de recherche et le sélecteur de stockage
 */
const Header = memo(({variant}: HeaderProps) => {
    const router = useRouter(); // Hook pour la navigation
    const {selectedStorage} = useItems(); // Récupère le stockage sélectionné

    // Fonction pour revenir à la page précédente
    const handleBack = useCallback(() => router.back(), [router]);
    // Fonction pour naviguer vers la page d'ajout d'item avec le stockage sélectionné
    const handleAdd = useCallback(() => router.push(`/(after-auth)/(app)/(tabs)/scan-product?storage=${selectedStorage}`), [router, selectedStorage]);

    return (
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {
                    // Affiche le bouton retour si variant = 'back'
                    variant === 'back' && (
                        <AnimatedPressable onPress={handleBack}>
                            <Ionicons name="chevron-back" color={colors.bg} size={32} />
                        </AnimatedPressable>
                    )
                }
                {/* Titre de l'application */}
                <Text style={styles.headerTitleText}>
                    keep fresh<Text style={{color: colors.success}}>.</Text>
                </Text>
                {
                    // Affiche le bouton d'ajout si variant = 'index'
                    variant === 'index' && (
                        <AnimatedPressable onPress={handleAdd}>
                            <Ionicons name="add" color={colors.bg} size={32} />
                        </AnimatedPressable>
                    )
                }
            </View>
            {
                // Affiche la barre de recherche et le sélecteur de stockage si variant = 'index'
                variant === 'index' && (
                    <View>
                        <Searchbar />
                        <StorageSelector />
                    </View>
                )
            }
        </View>
    )
});

// Nom d'affichage pour le composant (utile pour le debug)
Header.displayName = 'Header';

export default Header
