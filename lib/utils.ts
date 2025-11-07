import {colors} from "@/constants/colors";
import lang from "@/lib/lang";

/**
 * === UTILITAIRES ===
 *
 * Fichier contenant les fonctions helper utilisées à travers l'application :
 * - Calcul du statut d'expiration des produits
 * - Choix des couleurs selon les scores
 * - Sélection aléatoire de messages pour l'UI
 */

/**
 * Détermine le statut d'un produit en fonction de sa date d'expiration.
 *
 * @param expirationDate - Date d'expiration au format ISO string
 * @returns 'expired' si expiré, 'expiringSoon' si < 3 jours, 'fresh' sinon
 *
 * @example
 * getItemStatus('2025-10-16') // 'expiringSoon' si on est le 15/10/2025
 */
export function getItemStatus(expirationDate: Date): 'expired' | 'expiringSoon' | 'fresh' {
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'expired';
    } else if (diffDays <= 3) {
        return 'expiringSoon';
    } else {
        return 'fresh';
    }
}

/**
 * Retourne la couleur appropriée selon un pourcentage (ex: score anti-gaspi).
 *
 * @param percentage - Valeur entre 0 et 100
 * @returns Couleur rouge (<40), orange (<70), ou verte (>=70)
 *
 */
export function getProgressColor(percentage: number): string {
    if (percentage < 40) {
        return colors.danger;
    } else if (percentage < 70) {
        return colors.warning;
    } else {
        return colors.success;
    }
}

/**
 * Sélectionne aléatoirement un élément dans un tableau.
 * Utile pour afficher des messages variés dans l'UI.
 *
 * @internal - Fonction helper privée utilisée par les autres fonctions
 */
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Sélectionne un message aléatoire pour le score anti-gaspi.
 * Les messages varient selon le score (low, medium, high).
 *
 * @param score - Score anti-gaspi entre 0 et 100
 * @returns Objet avec title et content pour affichage
 */
export function getRandomAntiWasteMessage(score: number): {title: string, content: string} {
    if (score < 40) {
        return getRandomItem(lang.stats.antiWasteMessages.low);
    } else if (score < 70) {
        return getRandomItem(lang.stats.antiWasteMessages.medium);
    }
    return getRandomItem(lang.stats.antiWasteMessages.high);
}

/**
 * Sélectionne un message aléatoire pour le temps de consommation moyen.
 *
 * @param days - Nombre de jours moyen avant consommation
 * @returns Message descriptif (short: <=2j, medium: <=5j, long: >5j)
 */
export function getRandomConsumptionTimeMessage(days: number): string {
    if (days <= 2) {
        return getRandomItem(lang.stats.avgConsumptionTime.subtitle.short);
    } else if (days <= 5) {
        return getRandomItem(lang.stats.avgConsumptionTime.subtitle.medium);
    }
    return getRandomItem(lang.stats.avgConsumptionTime.subtitle.long);
}

/**
 * Retourne un placeholder aléatoire selon le type de stockage.
 * Utilisé dans le formulaire d'ajout d'item.
 *
 * @param storage - Type de stockage (fridge, freezer, pantry)
 * @returns Exemple de produit adapté au stockage
 */
export function getRandomPlaceholder(storage: "fridge" | "freezer" | "pantry"): string {
    return getRandomItem(lang.addItem.form.name.placeholder[storage]);
}

/**
 * Sélectionne un message aléatoire selon le nombre de produits expirés cette semaine.
 *
 * @param count - Nombre de produits expirés
 * @returns Message encourageant ou informatif selon le count
 */
export function getRandomExpiredThisWeekMessage(count: number): string {
    if (count === 0) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.none);
    } else if (count <= 3) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.few);
    } else if (count <= 7) {
        return getRandomItem(lang.stats.expiredThisWeek.subtitle.some);
    }
    return getRandomItem(lang.stats.expiredThisWeek.subtitle.many);
}

/**
 * Retourne un message d'erreur localisé pour les erreurs BetterAuth.
 *
 * @param errorCode - Code d'erreur BetterAuth
 * @returns Message d'erreur traduit ou message générique
 */
export function getBetterAuthErrorMessage(errorCode: string): string {
    return lang.errors.betterAuth[errorCode as keyof typeof lang.errors.betterAuth] ?? lang.errors.generic;
}

/**
 * Valide les données d'un formulaire avec Zod et retourne le premier message d'erreur.
 *
 * @param schema - Schéma de validation Zod
 * @param data - Données à valider
 * @returns Objet contenant success (boolean) et data/error
 *
 * @example
 * const result = validateFormData(signInSchema, { email, password });
 * if (!result.success) {
 *   Alert.alert('', result.error);
 *   return;
 * }
 */
export function validateFormData<T>(
    schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { issues: { message?: string }[] } } },
    data: unknown
): { success: true; data: T } | { success: false; error: string } {
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
        const firstError = parsedData.error?.issues[0]?.message;
        return {
            success: false,
            error: firstError || lang.errors.generic
        };
    }

    return {
        success: true,
        data: parsedData.data as T
    };
}

/**
 * Gère les erreurs d'authentification et affiche un message approprié.
 *
 * @param error - Objet d'erreur de BetterAuth (peut contenir un code d'erreur)
 * @param fallbackMessage - Message à afficher si l'erreur n'a pas de code
 * @returns Message d'erreur formaté
 *
 * @example
 * const { error } = await authClient.signIn.email(data);
 * if (error) {
 *   const message = handleAuthError(error);
 *   Alert.alert('', message);
 * }
 */
export function handleAuthError(error: { code?: string } | null | undefined, fallbackMessage?: string): string {
    if (!error) return fallbackMessage || lang.errors.generic;
    if (!error.code) return fallbackMessage || lang.errors.generic;
    return getBetterAuthErrorMessage(error.code);
}