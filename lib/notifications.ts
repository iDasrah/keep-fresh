import {
    Notification,
    NotificationBehavior,
} from "expo-notifications";

/**
 * Handler de notification (appelé quand une notification arrive).
 *
 * COMPORTEMENT :
 * - shouldPlaySound: false (pas de son)
 * - shouldSetBadge: false (pas de badge sur l'icône)
 * - shouldShowBanner: true (affiche la bannière en haut de l'écran)
 * - shouldShowList: true (affiche dans la liste des notifications)
 */
export async function handler(_: Notification): Promise<NotificationBehavior> {
    return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }
}
