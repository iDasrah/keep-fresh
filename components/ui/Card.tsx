import {View, ViewStyle, StyleProp} from 'react-native';
import React, {ReactNode} from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '@/constants/colors';
import {cardContainer, cardContent} from '@/assets/style/shared.styles';

/**
 * COMPONENT : Card avec LinearGradient
 *
 * Carte réutilisable avec bordure, ombre et gradient de fond.
 * Utilisée partout dans l'app (stats, items, shopping list, settings).
 *
 * STRUCTURE :
 * View (container) → LinearGradient → children
 *
 * PROPS :
 * - children : Contenu de la card
 * - style : Style custom pour le container (ex: margin, width)
 * - contentStyle : Style custom pour le contenu interne (ex: padding, flexDirection)
 * - gradient : Couleurs du gradient (défaut: cardGradient blanc → gris clair)
 *
 * STYLES PAR DÉFAUT (shared.styles) :
 * - cardContainer : Bordure, ombre, border-radius
 * - cardContent : Padding, flex
 */
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
