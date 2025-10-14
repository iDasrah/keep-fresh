import {View, ViewStyle, StyleProp} from 'react-native';
import React, {ReactNode} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '@/constants/colors';
import {cardContainer, cardContent} from '@/assets/style/shared.styles';

interface CardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    gradient?: readonly [string, string];
}

const Card = ({children, style, contentStyle, gradient = colors.cardGradient}: CardProps) => {
    return (
        <View style={[cardContainer, style]}>
            <LinearGradient colors={gradient as [string, string]} style={[cardContent, contentStyle]}>
                {children}
            </LinearGradient>
        </View>
    );
};

export default Card;
