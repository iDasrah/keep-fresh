import {TextInput, TextInputProps, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '@/constants/colors';
import {inputBase} from '@/assets/style/shared.styles';

/**
 * COMPONENT : FormInput (input de formulaire stylé)
 *
 * TextInput réutilisable avec styles par défaut de l'app.
 *
 * UTILISATION :
 * - Formulaire add-item/[productId] : Champ "Nom du produit"
 * - Hérite de tous les props de TextInput (value, onChangeText, etc.)
 *
 * STYLES :
 * - inputBase (shared.styles) : Bordure, padding, border-radius
 * - fontSize: 18 pour meilleure lisibilité
 * - placeholderTextColor: textMuted (gris clair)
 *
 * EXTENSIBILITÉ :
 * - Accepte un prop style pour override/extension des styles
 * - Spread ...props pour passer tous les props TextInput natifs
 */
type FormInputProps = TextInputProps

const FormInput = ({style, ...props}: FormInputProps) => {
    return (
        <TextInput
            style={[inputBase, localStyles.input, style]}
            placeholderTextColor={colors.textMuted}
            {...props}
        />
    );
};

const localStyles = StyleSheet.create({
    input: {
        fontSize: 18,
    }
});

export default FormInput;
