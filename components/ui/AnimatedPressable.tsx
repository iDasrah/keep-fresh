import {Pressable, PressableProps} from 'react-native';
import React, {ReactNode} from 'react';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {PRESS_SCALE} from '@/assets/style/shared.styles';

interface AnimatedPressableProps extends PressableProps {
    children: ReactNode;
    scale?: number;
}

const AnimatedPressable = ({children, scale = PRESS_SCALE, ...props}: AnimatedPressableProps) => {
    const scaleValue = useSharedValue(1);

    const handlePressIn = () => {
        scaleValue.value = withSpring(scale);
    };

    const handlePressOut = () => {
        scaleValue.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scaleValue.value}]
    }));

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedPressable;
