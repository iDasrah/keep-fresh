import {Text, TextProps, StyleProp, TextStyle} from 'react-native';
import React from 'react';
import {styles} from '@/assets/style/shared.styles';

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
