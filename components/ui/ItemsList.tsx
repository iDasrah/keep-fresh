import {View, ActivityIndicator} from 'react-native'
import React from 'react'
import {useDatabase} from "@/stores/database";
import {useQuery} from "@tanstack/react-query";
import Item from "@/components/ui/Item";
import {Item as ItemType} from "@/types";
import {styles} from "@/assets/style/items-list.styles";

interface ItemsListProps {
    storage?: "fridge" | "freezer" | "pantry";
    searchText?: string;
}

const ItemsList = ({storage, searchText}: ItemsListProps) => {
    const { searchItems, getAllItemsByStorage, getAllItems, isConnected } = useDatabase();

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

    return (
        <View style={styles.itemsList}>
            {items && items.map((item: ItemType) => (
                <Item key={item.id} item={item} />
            ))}
        </View>
    )
}
export default ItemsList
