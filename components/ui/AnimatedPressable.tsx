import {Pressable, PressableProps} from 'react-native';
import {ReactNode, memo, useCallback} from 'react';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {PRESS_SCALE} from '@/assets/style/shared.styles';

interface AnimatedPressableProps extends PressableProps {
    children: ReactNode;
    scale?: number;
}

const AnimatedPressable = memo(({children, scale = PRESS_SCALE, ...props}: AnimatedPressableProps) => {
    const scaleValue = useSharedValue(1);

    const handlePressIn = useCallback(() => {
        scaleValue.value = withSpring(scale);
    }, [scale, scaleValue]);

    const handlePressOut = useCallback(() => {
        scaleValue.value = withSpring(1);
    }, [scaleValue]);

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
});

AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;
