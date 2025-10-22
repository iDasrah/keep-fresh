import {View} from "react-native";
import {styles} from '@/assets/style/progress-indicator.styles';

interface ProgressIndicatorProps {
    currentStep: 1 | 2 | 3;
    totalSteps?: number;
}

/**
 * Indicateur de progression pour le processus d'inscription en plusieurs étapes.
 * Affiche des points représentant chaque étape avec un état visuel distinct.
 */
export default function ProgressIndicator({ currentStep, totalSteps = 3 }: ProgressIndicatorProps) {
    return (
        <View style={styles.progressContainer}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <View
                    key={step}
                    style={[
                        styles.progressDot,
                        step === currentStep && styles.progressDotActive,
                        step < currentStep && styles.progressDotCompleted,
                    ]}
                />
            ))}
        </View>
    );
}
