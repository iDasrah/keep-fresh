import {TextInput, TextInputProps, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '@/constants/colors';
import {inputBase} from '@/assets/style/shared.styles';

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
