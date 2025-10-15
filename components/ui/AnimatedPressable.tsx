import {Pressable, PressableProps} from 'react-native';
import {ReactNode, memo, useCallback} from 'react';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {PRESS_SCALE} from '@/assets/style/shared.styles';

/**
 * Props du composant AnimatedPressable
 *
 * - children : contenu à afficher à l'intérieur du bouton animé
 * - scale : facteur d'échelle lors de l'appui (par défaut PRESS_SCALE)
 * - ...props : toutes les autres props du Pressable natif
 */
interface AnimatedPressableProps extends PressableProps {
    children: ReactNode;
    scale?: number;
}

/**
 * Composant bouton animé réutilisable
 *
 * Ce composant utilise React.memo pour éviter les rendus inutiles si les props ne changent pas.
 * À l'appui, le bouton se met à l'échelle (effet de "press") grâce à react-native-reanimated.
 *
 * - useSharedValue : stocke la valeur d'échelle animée
 * - useCallback : mémorise les fonctions d'animation pour éviter leur recréation à chaque rendu
 * - useAnimatedStyle : applique la transformation d'échelle à la vue animée
 */
const AnimatedPressable = memo(({children, scale = PRESS_SCALE, ...props}: AnimatedPressableProps) => {
    // Valeur animée pour l'échelle
    const scaleValue = useSharedValue(1);

    // Fonction appelée lors de l'appui (press in) : lance l'animation d'échelle
    const handlePressIn = useCallback(() => {
        scaleValue.value = withSpring(scale);
    }, [scale, scaleValue]);

    // Fonction appelée lors du relâchement (press out) : remet l'échelle à 1
    const handlePressOut = useCallback(() => {
        scaleValue.value = withSpring(1);
    }, [scaleValue]);

    // Style animé appliqué à la vue enfant
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scaleValue.value}]
    }));

    // Structure du composant : Pressable → Animated.View → children
    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </Pressable>
    );
});

// Nom d'affichage pour le composant (utile en debug)
AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;
