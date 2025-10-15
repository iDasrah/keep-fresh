import {styles} from "@/assets/style/stat-card.styles";
import {Text, View} from "react-native";
import Card from "@/components/ui/Card";

interface StatCardProps {
    statValue: number,
    title: string,
    subtitle: string,
}

const StatCard = ({statValue, title, subtitle}: StatCardProps) => {
    return (
        <Card style={styles.statCard} contentStyle={styles.statCardContent}>
            <View>
                <Text style={styles.statCardValue}>{statValue}</Text>
                <Text style={styles.statCardTitle}>{title}</Text>
            </View>
            <Text style={styles.statCardSubtitle}>{subtitle}</Text>
        </Card>
    )
}
export default StatCard
