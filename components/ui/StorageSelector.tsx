import {View} from 'react-native'
import React, {useEffect} from 'react'
import {styles} from "@/assets/style/storage-selector.styles";
import {Link, useLocalSearchParams} from "expo-router";
import lang from "@/lib/lang";
import {useItems} from "@/stores/items";

const StorageSelector = () => {
    const {storage} = useLocalSearchParams();
    const {setSelectedStorage} = useItems();

    useEffect(() => {
        if (storage === undefined || storage === "fridge" || storage === "freezer" || storage === "pantry") {
            setSelectedStorage(storage === undefined ? "all" : storage);
        }
    }, [setSelectedStorage, storage]);

    return (
        <View style={styles.storageSelector}>
            <Link href="/" style={[styles.storageSelectorLink, storage === undefined && styles.activeStorageSelectorLink]}>{lang.header.storageSelector.all}</Link>
            <Link href="/?storage=fridge"  style={[styles.storageSelectorLink, storage === "fridge" && styles.activeStorageSelectorLink]}>{lang.header.storageSelector.fridge}</Link>
            <Link href="/?storage=freezer" style={[styles.storageSelectorLink, storage === "freezer" && styles.activeStorageSelectorLink]}>{lang.header.storageSelector.freezer}</Link>
            <Link href="/?storage=pantry" style={[styles.storageSelectorLink, storage === "pantry" && styles.activeStorageSelectorLink]}>{lang.header.storageSelector.pantry}</Link>
        </View>
    )
}
export default StorageSelector
