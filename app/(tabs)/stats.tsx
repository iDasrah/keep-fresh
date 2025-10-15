import {View, Text} from 'react-native'
import React from 'react'
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import CircularProgress from "@/components/ui/CircularProgress";
import lang from "@/lib/lang";
import {styles} from "@/assets/style/stats.styles";
import {useStats} from "@/stores/stats";
import {getRandomAntiWasteMessage, getRandomConsumptionTimeMessage, getRandomExpiredThisWeekMessage} from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";

const Stats = () => {
    const { userStats } = useStats();
    const { antiWasteScore, averageConsumptionTime, expiredThisWeek } = userStats;
    const message = getRandomAntiWasteMessage(antiWasteScore);

    return (
        <View>
            <Header />
            <View style={{padding: 16, gap: 16}}>
                <Card contentStyle={styles.antiWasteContent}>
                    <CircularProgress progress={antiWasteScore} />
                    <View style={styles.antiWasteMsg}>
                        <Text style={styles.antiWasteTitle}>{lang.stats.antiWasteTitle}</Text>
                        <Text style={styles.antiWasteMsgTitle}>{message.title}</Text>
                        <Text style={styles.antiWasteMsgContent}>{message.content}</Text>
                    </View>
                </Card>
                <View style={styles.statCardsContainer}>
                    <StatCard
                        statValue={averageConsumptionTime}
                        title={lang.stats.avgConsumptionTime.title}
                        subtitle={getRandomConsumptionTimeMessage(averageConsumptionTime)}
                    />
                    <StatCard statValue={expiredThisWeek} title={lang.stats.expiredThisWeek.title} subtitle={getRandomExpiredThisWeekMessage(expiredThisWeek)} />
                </View>
            </View>

        </View>
    )
}
export default Stats
