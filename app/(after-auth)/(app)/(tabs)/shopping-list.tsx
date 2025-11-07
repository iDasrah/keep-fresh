import {View, Text, ScrollView, TextInput, Alert} from "react-native";
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/shopping-list.styles";
import {SolarIcon} from "react-native-solar-icons";
import { colors } from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useState, useMemo} from "react";
import Card from "@/components/ui/Card";
import {z} from "zod/v4";
import {ShoppingListItem} from "@/types";

/**
 * SCREEN : Liste de courses
 *
 * Fonctionnalités :
 * - Ajout rapide d'items via TextInput + bouton
 * - Affichage de tous les items de la shopping list
 * - Suppression d'items (icône poubelle)
 * - État vide avec icône et message si aucun item
 *
 * Architecture :
 * - Utilise React Query (TanStack) pour :
 *   * useQuery : Fetch et cache des items
 *   * useMutation : Ajout et suppression optimistes
 * - Validation Zod pour éviter les items vides
 * - Persistance SQLite via store database
 */
const ShoppingList = () => {
    // TODO: Ajouter la récupération, l'ajout et la suppression des items depuis l'API

    // État local pour l'input d'ajout
    const [newItem, setNewItem] = useState('');
    const items: ShoppingListItem[] = [];

    /**
     * Schema Zod pour valider l'item avant ajout.
     * useMemo évite de recréer le schema à chaque render.
     * min(1) garantit qu'on n'ajoute pas de string vide.
     */
    const itemSchema = useMemo(() =>
        z.string().min(1, {error: lang.errors.shoppingList.emptyItemName}),
        []
    );

    /**
     * Handler d'ajout d'item.
     * 1. Valide avec Zod (trim pour éviter les espaces)
     * 2. Si valide : Lance la mutation
     * 3. Si invalide : Affiche le message d'erreur
     */
    const handleAddItem = async () => {
        const parsed = itemSchema.safeParse(newItem.trim());
        if (parsed.success) {
            Alert.alert('En travaux', 'L\'ajout d\'items sera disponible dans une prochaine version.');
        } else {
            const errorMessage = parsed.error.issues[0]?.message || lang.errors.generic;
            Alert.alert('', errorMessage);
        }
    }

    /**
     * Handler de suppression d'item.
     * Lance simplement la mutation avec l'ID de l'item.
     */
    const handleDeleteItem = async (id: number) => {
        Alert.alert('En travaux', 'La suppression des items de la liste de courses sera disponible dans une prochaine version.');
    }

    return (
        <View>
            <Header />
            <View style={styles.container}>
                {/* BARRE D'AJOUT D'ITEM (top) */}
                <View style={styles.addItemContainer}>
                    {/* Input avec icône CartPlus */}
                    <View style={styles.addItemInputContainer}>
                        <SolarIcon
                            name="CartPlus"
                            size={24}
                            color={colors.textMuted}
                            type="outline"
                        />
                        <TextInput
                            style={styles.addItemInput}
                            placeholder={lang.shoppingList.addItemFieldPlaceholder}
                            placeholderTextColor={colors.textMuted}
                            value={newItem}
                            onChangeText={setNewItem}
                        />
                    </View>
                    {/* Bouton + avec gradient noir */}
                    <AnimatedPressable style={styles.addItemButton} onPress={handleAddItem}>
                        <LinearGradient colors={colors.blackGradient} style={styles.addItemButtonContent}>
                            <Text style={styles.addItemButtonText}>+</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>

                {/* LISTE DES ITEMS OU EMPTY STATE */}
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                    {
                        items && items.length > 0 ? (
                            // Si des items existent : Affiche chaque item dans une Card
                            items.map(item => (
                                <Card key={item.id} style={styles.itemCard} contentStyle={styles.itemCardContent}>
                                    {/* Nom de l'item */}
                                    <Text style={styles.itemText}>{item.name}</Text>
                                    {/* Actions : bouton poubelle pour supprimer */}
                                    <View style={styles.itemActions}>
                                        <AnimatedPressable style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
                                            <SolarIcon
                                                name="TrashBinTrash"
                                                size={24}
                                                color={colors.danger}
                                                type="outline"
                                            />
                                        </AnimatedPressable>
                                    </View>
                                </Card>
                            ))
                        ) : (
                            // Si liste vide : Affiche un empty state avec icône et message
                            <View style={styles.emptyStateContainer}>
                                <SolarIcon
                                    name="Cart"
                                    size={64}
                                    color={colors.textMuted}
                                    type="outline"
                                />
                                <Text style={styles.emptyStateText}>
                                    {lang.shoppingList.emptyList}
                                </Text>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        </View>
    )
}
export default ShoppingList
