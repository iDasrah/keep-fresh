import {View, Text, Switch, Alert, Pressable} from 'react-native'
import Header from "@/components/ui/Header"
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";
import {styles} from "@/assets/style/settings.styles";
import {Ionicons} from "@expo/vector-icons";
import {useDatabase} from "@/stores/database";
import {useStats} from "@/stores/stats";
import {useSettings} from "@/stores/settings";
import {requestReview} from "expo-store-review";

const Settings = () => {
    const { clear } = useDatabase();
    const { resetStats } = useStats();
    const { settings, resetSettings, setSettings } = useSettings();

    const onDeleteData = async () => {
        Alert.alert(lang.alert.deleteData.title, lang.alert.deleteData.message, [
            {
                text: lang.alert.cancel,
                style: 'cancel'
            },
            {
                text: lang.alert.deleteData.delete,
                style: 'destructive',
                onPress: async () => {
                    await Promise.all([
                        clear(),
                        resetStats(),
                        resetSettings()
                    ]);
                }
            }
        ]);
    }

    return (
        <View>
            <Header />
            <View style={{padding: 16, gap: 16}}>
                <View style={styles.notificationsContainer}>
                    <LinearGradient colors={colors.cardGradient} style={styles.notificationsContent}>
                        <Text style={styles.notificationsTitle}>{lang.settings.notifications.title}</Text>
                        <View style={styles.notificationItem}>
                            <View>
                                <Text style={styles.notificationItemTitle}>{lang.settings.notifications.expiredProduct.title}</Text>
                                <Text style={styles.notificationItemDesc}>{lang.settings.notifications.expiredProduct.description}</Text>
                            </View>
                            <Switch
                                value={settings.expiredNotification}
                                onValueChange={(value) => setSettings({...settings, expiredNotification: value})}
                            />
                        </View>
                        <View style={styles.notificationItem}>
                            <View>
                                <Text style={styles.notificationItemTitle}>{lang.settings.notifications.expiringSoonProduct.title}</Text>
                                <Text style={styles.notificationItemDesc}>{lang.settings.notifications.expiringSoonProduct.description}</Text>
                            </View>
                            <Switch
                                value={settings.soonExpirationNotification}
                                onValueChange={(value) => setSettings({...settings, soonExpirationNotification: value})}
                            />
                        </View>
                    </LinearGradient>
                </View>
                <Pressable style={styles.feedbackContainer} onPress={requestReview}>
                    <LinearGradient colors={colors.cardGradient} style={styles.feedbackContent}>
                        <Text style={styles.feedbackTitle}>{lang.settings.feedback.title}</Text>
                        <Ionicons name="chevron-forward" size={32} color={colors.textMuted} />
                    </LinearGradient>
                </Pressable>
                <Pressable style={styles.deleteDataContainer} onPress={onDeleteData}>
                    <LinearGradient colors={colors.cardGradient} style={styles.deleteDataContent}>
                        <Text style={styles.deleteDataTitle}>{lang.settings.deleteData.title}</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    )
}
export default Settings
