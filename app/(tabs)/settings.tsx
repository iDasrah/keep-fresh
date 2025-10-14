import {View, Text, Switch, Alert} from 'react-native'
import Header from "@/components/ui/Header"
import Card from "@/components/ui/Card";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";
import {styles} from "@/assets/style/settings.styles";
import {Ionicons} from "@expo/vector-icons";
import {useDatabase} from "@/stores/database";
import {useStats} from "@/stores/stats";
import {useSettings} from "@/stores/settings";
import {requestReview} from "expo-store-review";
import {useNotifications} from "@/stores/notifications";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useRouter} from "expo-router";

const Settings = () => {
    const { clear } = useDatabase();
    const { resetStats } = useStats();
    const { clearAllExpiredNotifications, clearAllSoonExpiredNotifications, scheduleAllItemsExpiredNotifications, scheduleAllItemsSoonExpiredNotifications, clearAllNotifications } = useNotifications();
    const { settings, resetSettings, setSettings } = useSettings();
    const router = useRouter();

    const onExpiredNotificationChange = async (value: boolean) => {
        setSettings({ expiredNotification: value });
        if (!value) {
            clearAllExpiredNotifications();
        } else {
            await scheduleAllItemsExpiredNotifications();
        }
    }

    const onSoonExpirationNotificationChange = async (value: boolean) => {
        setSettings({ soonExpirationNotification: value });
        if (!value) {
            clearAllSoonExpiredNotifications();
        } else {
            await scheduleAllItemsSoonExpiredNotifications();
        }
    }

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
                        resetSettings(),
                        clearAllNotifications(),
                    ]);
                    router.push('/');
                }
            }
        ]);
    }

    return (
        <View>
            <Header />
            <View style={{padding: 16, gap: 16}}>
                <Card>
                    <Text style={styles.notificationsTitle}>{lang.settings.notifications.title}</Text>
                    <View style={styles.notificationItem}>
                        <View>
                            <Text style={styles.notificationItemTitle}>{lang.settings.notifications.expiredProduct.title}</Text>
                            <Text style={styles.notificationItemDesc}>{lang.settings.notifications.expiredProduct.description}</Text>
                        </View>
                        <Switch
                            value={settings.expiredNotification}
                            onValueChange={onExpiredNotificationChange}
                        />
                    </View>
                    <View style={styles.notificationItem}>
                        <View>
                            <Text style={styles.notificationItemTitle}>{lang.settings.notifications.expiringSoonProduct.title}</Text>
                            <Text style={styles.notificationItemDesc}>{lang.settings.notifications.expiringSoonProduct.description}</Text>
                        </View>
                        <Switch
                            value={settings.soonExpirationNotification}
                            onValueChange={onSoonExpirationNotificationChange}
                        />
                    </View>
                </Card>
                <AnimatedPressable scale={.98} onPress={requestReview}>
                    <Card contentStyle={styles.feedbackContent}>
                        <Text style={styles.feedbackTitle}>{lang.settings.feedback.title}</Text>
                        <Ionicons name="chevron-forward" size={32} color={colors.textMuted} />
                    </Card>
                </AnimatedPressable>
                <AnimatedPressable scale={.98} onPress={onDeleteData}>
                    <Card contentStyle={styles.deleteDataContent}>
                        <Text style={styles.deleteDataTitle}>{lang.settings.deleteData.title}</Text>
                    </Card>
                </AnimatedPressable>
            </View>
        </View>
    )
}
export default Settings
