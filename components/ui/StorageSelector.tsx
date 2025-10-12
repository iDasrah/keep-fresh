import {View} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/storage-selector.styles";
import {Link} from "expo-router";
import lang from "@/lib/lang";

const StorageSelector = () => {
    const activeStorage = "all" // TODO: make this dynamic

    return (
        <View style={styles.storageSelector}>
            <Link href="/" style={[styles.storageSelectorLink, activeStorage === "all" && styles.activeStorageSelectorLink]}>{lang.header.storageSelector.all}</Link>
            <Link href="/" style={styles.storageSelectorLink}>{lang.header.storageSelector.fridge}</Link>
            <Link href="/" style={styles.storageSelectorLink}>{lang.header.storageSelector.freezer}</Link>
            <Link href="/" style={styles.storageSelectorLink}>{lang.header.storageSelector.pantry}</Link>
        </View>
    )
}
export default StorageSelector
