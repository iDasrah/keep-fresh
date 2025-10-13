import {View, Text} from 'react-native'
import React from 'react'
import Header from "@/components/ui/Header";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
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
                <View style={styles.antiWasteContainer}>
                    <LinearGradient colors={colors.cardGradient} style={styles.antiWasteContent}>
                        <CircularProgress progress={antiWasteScore} />
                        <View style={styles.antiWasteMsg}>
                            <Text style={styles.antiWasteTitle}>{lang.stats.antiWasteTitle}</Text>
                            <Text style={styles.antiWasteMsgTitle}>{message.title}</Text>
                            <Text style={styles.antiWasteMsgContent}>{message.content}</Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>

        </View>
    )
}
export default Stats
