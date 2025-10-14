import {View, Text} from 'react-native'
import React from 'react'
import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import CircularProgress from "@/components/ui/CircularProgress";
import lang from "@/lib/lang";
import {styles} from "@/assets/style/stats.styles";
import {useStats} from "@/stores/stats";
import {getRandomAntiWasteMessage} from "@/lib/utils";

const Stats = () => {
    const { userStats } = useStats();
    const { antiWasteScore } = userStats;
    const message = getRandomAntiWasteMessage(antiWasteScore);

    return (
        <View>
            <Header />
            <View style={{padding: 16}}>
                <Card contentStyle={styles.antiWasteContent}>
                    <CircularProgress progress={antiWasteScore} />
                    <View style={styles.antiWasteMsg}>
                        <Text style={styles.antiWasteTitle}>{lang.stats.antiWasteTitle}</Text>
                        <Text style={styles.antiWasteMsgTitle}>{message.title}</Text>
                        <Text style={styles.antiWasteMsgContent}>{message.content}</Text>
                    </View>
                </Card>
            </View>

        </View>
    )
}
export default Stats
