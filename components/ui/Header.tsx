import {View, Text} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/header.styles";
import { colors } from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import Searchbar from "./Searchbar";
import StorageSelector from "@/components/ui/StorageSelector";

interface HeaderProps {
    variant?: 'index' | 'back';
}

const Header = ({variant}: HeaderProps) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {
                    variant === 'back' && (
                        <Ionicons name="chevron-back" color={colors.bg} size={32} />
                    )
                }
                <Text style={styles.headerTitleText}>
                    fridgely<Text style={{color: colors.success}}>.</Text>
                </Text>
                {
                    variant === 'index' && (
                        <Ionicons name="add" color={colors.bg} size={32} />
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
