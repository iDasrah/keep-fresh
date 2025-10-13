import {View, Text, Pressable} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/header.styles";
import { colors } from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import Searchbar from "./Searchbar";
import StorageSelector from "@/components/ui/StorageSelector";
import { useRouter } from "expo-router";

interface HeaderProps {
    variant?: 'index' | 'back';
}

const Header = ({variant}: HeaderProps) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {
                    variant === 'back' && (
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="chevron-back" color={colors.bg} size={32} />
                        </Pressable>
                    )
                }
                <Text style={styles.headerTitleText}>
                    keep fresh<Text style={{color: colors.success}}>.</Text>
                </Text>
                {
                    variant === 'index' && (
                        <Pressable onPress={() => router.push("/add-item")}>
                            <Ionicons name="add" color={colors.bg} size={32} />
                        </Pressable>
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
}
export default Header
