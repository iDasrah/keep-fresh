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

/**
 * SCREEN : Page des statistiques anti-gaspi
 *
 * Affiche 3 indicateurs principaux :
 * 1. Score Anti-Gaspi (0-100) : CircularProgress avec message motivant
 *    - Basé sur le ratio items jetés / items ajoutés
 *    - Plus le score est élevé, moins on gaspille
 *
 * 2. Temps moyen de consommation (en jours)
 *    - Moyenne du temps entre ajout et consommation des produits
 *    - Aide à comprendre ses habitudes d'achat
 *
 * 3. Produits expirés cette semaine
 *    - Compteur qui se réinitialise chaque semaine
 *    - Feedback immédiat sur la gestion hebdomadaire
 *
 * Les messages varient aléatoirement pour garder l'UI dynamique.
 */
const Stats = () => {
    // Récupère les stats depuis AsyncStorage (chargées au démarrage)
    const { userStats } = useStats();
    const { antiWasteScore, averageConsumptionTime, expiredThisWeek } = userStats;

    // Sélectionne un message aléatoire selon le score (low/medium/high)
    const message = getRandomAntiWasteMessage(antiWasteScore);

    return (
        <View>
            <Header />

            <View style={{padding: 16, gap: 16}}>
                {/* Carte principale : Score Anti-Gaspi avec CircularProgress */}
                <Card contentStyle={styles.antiWasteContent}>
                    {/* CircularProgress : cercle animé avec couleur selon score */}
                    <CircularProgress progress={antiWasteScore} />

                    {/* Message motivant qui change selon le score */}
                    <View style={styles.antiWasteMsg}>
                        <Text style={styles.antiWasteTitle}>
                            {lang.stats.antiWasteTitle}
                        </Text>
                        {/* Titre du message */}
                        <Text style={styles.antiWasteMsgTitle}>
                            {message.title}
                        </Text>
                        {/* Contenu du message */}
                        <Text style={styles.antiWasteMsgContent}>
                            {message.content}
                        </Text>
                    </View>
                </Card>

                {/* Conteneur des 2 StatCards (même hauteur grâce au flex) */}
                <View style={styles.statCardsContainer}>
                    {/*
                        StatCard 1 : Temps moyen de consommation
                        - Affiche le nombre de jours en gros
                        - Sous-titre variable selon la durée (rapide/moyen/long)
                    */}
                    <StatCard
                        statValue={averageConsumptionTime}
                        title={lang.stats.avgConsumptionTime.title}
                        subtitle={getRandomConsumptionTimeMessage(averageConsumptionTime)}
                    />

                    {/*
                        StatCard 2 : Produits expirés cette semaine
                        - Compteur simple
                        - Message encourageant si 0, sinon motivant à faire mieux
                    */}
                    <StatCard
                        statValue={expiredThisWeek}
                        title={lang.stats.expiredThisWeek.title}
                        subtitle={getRandomExpiredThisWeekMessage(expiredThisWeek)}
                    />
                </View>
            </View>
        </View>
    )
}

export default Stats
