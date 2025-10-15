import {View, ActivityIndicator, Text, Pressable} from 'react-native'
import React from 'react'
import {useDatabase} from "@/stores/database";
import {useQuery} from "@tanstack/react-query";
import Item from "@/components/ui/Item";
import {Item as ItemType} from "@/types";
import {styles} from "@/assets/style/items-list.styles";
import lang from "@/lib/lang";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useRouter} from "expo-router";

interface ItemsListProps {
    storage?: "fridge" | "freezer" | "pantry";
    searchText?: string;
}

const ItemsList = ({storage, searchText}: ItemsListProps) => {
    const { searchItems, getAllItemsByStorage, getAllItems, isConnected } = useDatabase();
    const router = useRouter();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const { data: items, isLoading } = useQuery({
        queryKey: ['items', storage, searchText],
        queryFn: async () => {
            if (searchText) return searchItems(searchText, storage);
            return storage ? getAllItemsByStorage(storage) : getAllItems();
        },
        enabled: isConnected
    });

    items?.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (!items || items.length === 0) {
        const handlePressIn = () => {
            scale.value = withSpring(0.95);
        }

        const handlePressOut = () => {
            scale.value = withSpring(1);
        }

        return (
            <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsText}>{lang.noItems.title}</Text>
                <Animated.View style={animatedStyle}>
                    <Pressable onPress={() => router.push(`/add-item?storage=${storage}`)} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                        <LinearGradient colors={colors.blackGradient} style={styles.addButton}>
                            <Text style={styles.addButtonText}>{lang.noItems.button}</Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>
        )
    }

    return (
        <View style={styles.itemsList}>
            {items && items.map((item: ItemType) => (
                <Item key={item.id} item={item} />
            ))}
        </View>
    )
}
export default ItemsList
