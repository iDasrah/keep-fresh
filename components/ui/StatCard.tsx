import {styles} from "@/assets/style/stat-card.styles";
import {Text, View} from "react-native";
import Card from "@/components/ui/Card";

/**
 * COMPONENT : StatCard (carte de statistique)
 *
 * Affiche une stat avec :
 * - Valeur numérique en gros (ex: 5 jours, 3 produits)
 * - Titre explicatif (ex: "Temps moyen de consommation")
 * - Sous-titre contextuel qui varie (ex: "Consommation rapide" ou "Tu peux faire mieux")
 *
 * UTILISATION :
 * Principalement dans la page stats.tsx pour afficher :
 * - Le temps moyen de consommation
 * - Le nombre de produits expirés cette semaine
 *
 * LAYOUT :
 * Flex column avec justifyContent space-between pour pousser le subtitle en bas.
 * Permet d'avoir des cards de même hauteur même si les subtitles ont des longueurs différentes.
 */
interface StatCardProps {
    statValue: number,
    title: string,
    subtitle: string,
}

const StatCard = ({statValue, title, subtitle}: StatCardProps) => {
    return (
        <Card style={styles.statCard} contentStyle={styles.statCardContent}>
            {/* Partie haute : Valeur + Titre */}
            <View>
                <Text style={styles.statCardValue}>{statValue}</Text>
                <Text style={styles.statCardTitle}>{title}</Text>
            </View>
            {/* Partie basse : Sous-titre (poussé en bas par flexbox) */}
            <Text style={styles.statCardSubtitle}>{subtitle}</Text>
        </Card>
    )
}
export default StatCard
