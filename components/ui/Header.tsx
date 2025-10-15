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

interface HeaderProps {
    variant?: 'index' | 'back';
}

const Header = memo(({variant}: HeaderProps) => {
    const router = useRouter();
    const {selectedStorage} = useItems();

    const handleBack = useCallback(() => router.back(), [router]);
    const handleAdd = useCallback(() => router.push(`/add-item?storage=${selectedStorage}`), [router, selectedStorage]);

    return (
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {
                    variant === 'back' && (
                        <AnimatedPressable onPress={handleBack}>
                            <Ionicons name="chevron-back" color={colors.bg} size={32} />
                        </AnimatedPressable>
                    )
                }
                <Text style={styles.headerTitleText}>
                    keep fresh<Text style={{color: colors.success}}>.</Text>
                </Text>
                {
                    variant === 'index' && (
                        <AnimatedPressable onPress={handleAdd}>
                            <Ionicons name="add" color={colors.bg} size={32} />
                        </AnimatedPressable>
                    )
                }
            </View>
            {
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

Header.displayName = 'Header';

export default Header
