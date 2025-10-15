import {View, Text, ScrollView, TextInput} from "react-native";
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/shopping-list.styles";
import {SolarIcon} from "react-native-solar-icons";
import { colors } from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useState} from "react";
import {useDatabase} from "@/stores/database";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Card from "@/components/ui/Card";

const ShoppingList = () => {
    const [newItem, setNewItem] = useState('');
    const { addShoppingListItem, getShoppingList } = useDatabase();
    const queryClient = useQueryClient();

    const { data: items } = useQuery({
        queryKey: ['shoppingListItems'],
        queryFn: async () => await getShoppingList(),
    });

    const createItemMut = useMutation({
        mutationKey: ['addShoppingListItem'],
        mutationFn: async (item: string) => await addShoppingListItem(item),
        onSuccess: () => {
            setNewItem('');
            queryClient.invalidateQueries({ queryKey: ['shoppingListItems'] });
        }
    });

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

    const handleAddItem = async () => {
        createItemMut.mutate(newItem);
    }

    const handleDeleteItem = async (id: number) => {
        deleteItemMut.mutate(id);
    }

    return (
        <View>
            <Header />
            <View style={{padding: 16}}>
                <View style={styles.addItemContainer}>
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
                    <AnimatedPressable style={styles.addItemButton} onPress={handleAddItem}>
                        <LinearGradient colors={colors.blackGradient} style={styles.addItemButtonContent}>
                            <Text style={styles.addItemButtonText}>+</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                    {
                        items && items.length > 0 ? (
                            items.map(item => (
                                <Card key={item.id} style={styles.itemCard} contentStyle={styles.itemCardContent}>
                                    <Text style={styles.itemText}>{item.name}</Text>
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
                            <View style={{alignItems: "center", marginTop: 40}}>
                                <SolarIcon
                                    name="Cart"
                                    size={64}
                                    color={colors.textMuted}
                                    type="outline"
                                />
                                <Text style={{color: colors.textMuted, fontSize: 16, marginTop: 16}}>
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
