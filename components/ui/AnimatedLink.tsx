import React, {ReactNode, memo} from 'react';
import {Pressable, PressableProps} from "react-native";

interface AnimatedLinkProps extends PressableProps {
    children: ReactNode;
}

const AnimatedLink = memo(({children, ...props}: AnimatedLinkProps) => {
    return (
        <Pressable style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
        })} {...props}>
            {children}
        </Pressable>
    );
});

AnimatedLink.displayName = 'AnimatedLink';

export default AnimatedLink;
