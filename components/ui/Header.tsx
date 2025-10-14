import {View, Text, Pressable} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/header.styles";
import { colors } from "@/constants/colors";
import {Ionicons} from "@expo/vector-icons";
import Searchbar from "./Searchbar";
import StorageSelector from "@/components/ui/StorageSelector";
import { useRouter } from "expo-router";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";

interface HeaderProps {
    variant?: 'index' | 'back';
}

const Header = ({variant}: HeaderProps) => {
    const router = useRouter();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.90);
    }

    const handlePressOut = () => {
        scale.value = withSpring(1);
    }

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {
                    variant === 'back' && (
                        <Pressable onPress={() => router.back()} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                            <Animated.View style={animatedStyle}>
                                <Ionicons name="chevron-back" color={colors.bg} size={32} />
                            </Animated.View>
                        </Pressable>
                    )
                }
                <Text style={styles.headerTitleText}>
                    keep fresh<Text style={{color: colors.success}}>.</Text>
                </Text>
                {
                    variant === 'index' && (
                        <Pressable onPress={() => router.push("/add-item")} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                            <Animated.View style={animatedStyle}>
                                <Ionicons name="add" color={colors.bg} size={32} />
                            </Animated.View>
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
