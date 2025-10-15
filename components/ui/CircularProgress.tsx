import {View, Text} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/circular-progress.styles";
import Svg, {Circle} from 'react-native-svg';
import {getProgressColor} from "@/lib/utils";

/**
 * COMPONENT : Circular Progress (cercle de progression animé)
 *
 * Affiche un pourcentage sous forme de cercle avec :
 * - Fond gris clair (#D9D9D9)
 * - Arc coloré selon le score (rouge/orange/vert)
 * - Nombre au centre
 *
 * TECHNIQUE SVG :
 * - 2 Cercles superposés :
 *   1. Cercle de fond (gris, toujours complet)
 *   2. Cercle de progression (coloré, strokeDasharray + strokeDashoffset)
 *
 * CALCULS :
 * - radius : (size - strokeWidth) / 2
 * - circumference : 2πr (périmètre total du cercle)
 * - strokeDashoffset : Détermine la portion visible du cercle
 *   → circumference - (progress / 100) * circumference
 *   → Ex: progress=75 → offset=25% de la circonférence → affiche 75%
 *
 * ROTATION :
 * - transform="rotate(-90 centerX centerY)" : Démarre à 12h (top)
 * - Sans rotation, le cercle démarrerait à 3h (right)
 *
 * COULEUR DYNAMIQUE :
 * - getProgressColor(progress) retourne rouge/orange/vert selon le score
 */
interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
}

const CircularProgress = ({progress, size = 100, strokeWidth = 10}: CircularProgressProps) => {
    // Calcul du rayon (on retire strokeWidth pour éviter que le cercle dépasse)
    const radius = (size - strokeWidth) / 2;

    // Circonférence (périmètre) = 2πr
    const circumference = 2 * Math.PI * radius;

    // Offset pour afficher le pourcentage correct
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Couleur dynamique selon le score (rouge < 40, orange < 70, vert >= 70)
    const color = getProgressColor(progress);

    // Centre du SVG (pour la rotation)
    const centerX = size / 2;
    const centerY = size / 2;

    return (
        <View style={[styles.container, {width: size, height: size}]}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* CERCLE 1 : Fond gris (toujours visible à 100%) */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke="#D9D9D9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* CERCLE 2 : Progression colorée (strokeDashoffset contrôle le %) */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference} // Circonférence totale
                    strokeDashoffset={strokeDashoffset} // Portion cachée
                    strokeLinecap="round" // Bouts arrondis
                    transform={`rotate(-90 ${centerX} ${centerY})`} // Démarre à 12h (top)
                />
            </Svg>
            {/* Nombre au centre (superposé par absolute positioning) */}
            <View style={styles.textContainer}>
                <Text style={[styles.progressText, {color: color}]}>{progress}</Text>
            </View>
        </View>
    )
}
export default CircularProgress