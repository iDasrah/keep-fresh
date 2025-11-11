import {View, Text, Switch, Alert} from 'react-native'
import Header from "@/components/ui/Header"
import Card from "@/components/ui/Card";
import {colors} from "@/constants/colors";
import {styles} from "@/assets/style/settings.styles";
import {Ionicons} from "@expo/vector-icons";
import {requestReview} from "expo-store-review";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";

/**
 * SCREEN : Page des paramètres
 *
 * SECTIONS :
 * 1. Notifications
 *    - Toggle "Produit expiré" : Notif le jour J
 *    - Toggle "Produit bientôt expiré" : Notif 3 jours avant
 *
 * 2. Feedback
 *    - Bouton pour ouvrir la modal de review dans l'App Store
 *
 * 3. Supprimer mes données (destructif)
 *    - Efface TOUT : DB, AsyncStorage stats/settings, notifications
 *    - Confirmation Alert avant suppression
 *    - Redirige vers l'accueil après
 *
 * Les settings sont persistés dans AsyncStorage via useSettings store.
 */
const Settings = () => {
    //TODO: Ajouter les settings de l'API
    const { t, ready } = useTranslation();
    const router = useRouter();

    if (!ready) {
        return;
    }

    /**
     * Handler pour le toggle "Produit expiré"
     * - Si activé : Schedule toutes les notifs d'expiration
     * - Si désactivé : Annule toutes les notifs d'expiration
     */
    const onExpiredNotificationChange = async (value: boolean) => {
    }

    /**
     * Handler pour le toggle "Produit bientôt expiré"
     * - Si activé : Schedule toutes les notifs "soon expired"
     * - Si désactivé : Annule toutes les notifs "soon expired"
     */
    const onSoonExpirationNotificationChange = async (value: boolean) => {
    }

    /**
     * Handler pour "Supprimer mes données"
     * ATTENTION : Opération IRRÉVERSIBLE !
     *
     * Efface :
     * - Toute la DB SQLite (items + shopping_list)
     * - Toutes les stats dans AsyncStorage
     * - Tous les settings dans AsyncStorage
     * - Toutes les notifications programmées
     *
     * Redirige vers l'accueil après suppression.
     */
    const onDeleteData = async () => {
        Alert.alert(
            t('alert.deleteData.title'),
            t('alert.deleteData.message'),
            [
                {
                    text: t('alert.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('alert.deleteData.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        // Retour à l'accueil après reset complet
                        router.push('/');
                    }
                }
            ]
        );
        Alert.alert('En travaux', 'La suppression des données sera disponible dans une prochaine version.');
    }

    return (
        <View>
            <Header />

            <View style={{padding: 16, gap: 16}}>
                {/* SECTION 1 : Notifications */}
                <Card>
                    <Text style={styles.notificationsTitle}>
                        {t('settings.notifications.title')}
                    </Text>

                    {/* Toggle 1 : Notification d'expiration */}
                    <View style={styles.notificationItem}>
                        <View>
                            <Text style={styles.notificationItemTitle}>
                                {t('settings.notifications.expiredProduct.title')}
                            </Text>
                            <Text style={styles.notificationItemDesc}>
                                {t('settings.notifications.expiredProduct.description')}
                            </Text>
                        </View>
                        <Switch
                            value={false}
                            onValueChange={onExpiredNotificationChange}
                        />
                    </View>

                    {/* Toggle 2 : Notification "bientôt expiré" */}
                    <View style={styles.notificationItem}>
                        <View>
                            <Text style={styles.notificationItemTitle}>
                                {t('settings.notifications.expiringSoonProduct.title')}
                            </Text>
                            <Text style={styles.notificationItemDesc}>
                                {t('settings.notifications.expiringSoonProduct.description')}
                            </Text>
                        </View>
                        <Switch
                            value={false}
                            onValueChange={onSoonExpirationNotificationChange}
                        />
                    </View>
                </Card>

                {/* SECTION 2 : Feedback / Review */}
                <AnimatedPressable scale={.98} onPress={requestReview}>
                    <Card contentStyle={styles.feedbackContent}>
                        <Text style={styles.feedbackTitle}>
                            {t('settings.feedback.title')}
                        </Text>
                        <Ionicons name="chevron-forward" size={32} color={colors.textMuted} />
                    </Card>
                </AnimatedPressable>

                {/* SECTION 3 : Supprimer mes données (DANGER ZONE) */}
                <AnimatedPressable scale={.98} onPress={onDeleteData}>
                    <Card contentStyle={styles.deleteDataContent}>
                        <Text style={styles.deleteDataTitle}>
                            {t('settings.deleteData.title')}
                        </Text>
                    </Card>
                </AnimatedPressable>
            </View>
        </View>
    )
}

export default Settings
