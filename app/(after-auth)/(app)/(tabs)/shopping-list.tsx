import {View, Text, ScrollView, TextInput, Alert} from "react-native";
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/shopping-list.styles";
import {SolarIcon} from "react-native-solar-icons";
import { colors } from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useState, useMemo} from "react";
import {useDatabase} from "@/stores/database";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import {z} from "zod/v4";

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
    // État local pour l'input d'ajout
    const [newItem, setNewItem] = useState('');

    /**
     * Schema Zod pour valider l'item avant ajout.
     * useMemo évite de recréer le schema à chaque render.
     * min(1) garantit qu'on n'ajoute pas de string vide.
     */
    const itemSchema = useMemo(() =>
        z.string().min(1, {error: lang.errors.shoppingList.emptyItemName}),
        []
    );
    const { addShoppingListItem, getShoppingList } = useDatabase();
    const queryClient = useQueryClient();

    /**
     * useQuery : Récupère tous les items de la shopping list.
     * - queryKey : identifiant unique pour le cache
     * - queryFn : fonction async qui retourne les données
     * React Query gère automatiquement :
     * - Le loading state
     * - Le caching
     * - Le refetch automatique
     */
    const { data: items } = useQuery({
        queryKey: ['shoppingListItems'],
        queryFn: async () => await getShoppingList(),
    });

    /**
     * Mutation pour AJOUTER un item.
     * - mutationFn : fonction async d'insertion SQLite
     * - onSuccess : Actions après succès
     *   1. Vide l'input
     *   2. Invalide le cache React Query pour refetch automatiquement
     */
    const createItemMut = useMutation({
        mutationKey: ['addShoppingListItem'],
        mutationFn: async (item: string) => await addShoppingListItem(item),
        onSuccess: () => {
            setNewItem('');
            queryClient.invalidateQueries({ queryKey: ['shoppingListItems'] });
        }
    });

    /**
     * Mutation pour SUPPRIMER un item.
     * - Récupère deleteShoppingListItem depuis le store global (getState)
     * - onSuccess : Invalide le cache pour refetch la liste mise à jour
     */
    const deleteItemMut = useMutation({
        mutationKey: ['deleteShoppingListItem'],
        mutationFn: async (id: number) => {
            const { deleteShoppingListItem } = useDatabase.getState();
            await deleteShoppingListItem(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shoppingListItems'] });
        }
    });

    /**
     * Handler d'ajout d'item.
     * 1. Valide avec Zod (trim pour éviter les espaces)
     * 2. Si valide : Lance la mutation
     * 3. Si invalide : Affiche le message d'erreur
     */
    const handleAddItem = async () => {
        const parsed = itemSchema.safeParse(newItem.trim());
        if (parsed.success) {
            createItemMut.mutate(parsed.data);
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
        deleteItemMut.mutate(id);
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
