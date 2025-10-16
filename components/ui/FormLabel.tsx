import {Text, TextProps, StyleProp, TextStyle} from 'react-native';
import React from 'react';
import {styles} from '@/assets/style/shared.styles';

/**
 * COMPONENT : FormLabel (label de formulaire)
 *
 * Label réutilisable pour les champs de formulaire.
 *
 * UTILISATION :
 * - Formulaire add-item : Au-dessus de chaque input
 *   * "Nom du produit"
 *   * "Quantité"
 *   * "Unité"
 *   * "Date d'expiration"
 *   * "Stockage"
 *
 * STYLES :
 * - styles.label (shared.styles) : Police, taille, couleur, marginBottom
 *
 * EXTENSIBILITÉ :
 * - Accepte un prop style pour override/extension
 * - Spread ...props pour passer tous les props Text natifs
 */
interface FormLabelProps extends TextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

const FormLabel = ({children, style, ...props}: FormLabelProps) => {
    return (
        <Text style={[styles.label, style]} {...props}>
            {children}
        </Text>
    );
};

export default FormLabel;
