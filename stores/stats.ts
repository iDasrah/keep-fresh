import {create} from 'zustand/react';
import {Stats} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {isSameWeek} from "date-fns";

/**
 * Store Zustand pour gérer les statistiques utilisateur anti-gaspi.
 *
 * Calcule et persiste :
 * - Score anti-gaspi (basé sur ratio items jetés / items ajoutés)
 * - Temps moyen de consommation des produits
 * - Nombre de produits expirés cette semaine
 * - Historique hebdomadaire des scores
 *
 * Les données sont sauvegardées dans AsyncStorage à chaque modification.
 */
interface StatsState {
    userStats: Stats,

    consumptionTimes: number[],
    lastUpdatedExpiredThisWeek: Date,

    // Actions de mise à jour
    addTotalAddedItems: () => void;
    addThrownAwayItems: () => void;
    addConsumptionTime: (time: number) => void;
    updateAverageConsumptionTime: () => Promise<void>;
    updateAntiWasteScore: () => void;
    addWeeklyAntiWasteScore: (score: number) => void;
    resetStats: () => Promise<void>;

    // Persistance
    loadData: () => Promise<void>;
    saveData: () => Promise<void>;
}

export const useStats = create<StatsState>((set, get) => ({
    userStats: {
        antiWasteScore: 100,
        totalAddedItems: 0,
        thrownAwayItems: 0,
        expiredThisWeek: 0,
        averageConsumptionTime: 0,
        antiWasteScoreByWeek: [],
    },

    consumptionTimes: [],
    lastUpdatedExpiredThisWeek: new Date(),

    /**
     * Incrémente le compteur d'items ajoutés.
     * Met à jour le score anti-gaspi automatiquement.
     */
    addTotalAddedItems: async () => {
        set((state) => ({
            userStats: {
                ...state.userStats,
                totalAddedItems: state.userStats.totalAddedItems + 1,
            }
        }));
        get().updateAntiWasteScore();
        await get().saveData();
    },

    /**
     * Incrémente le compteur d'items jetés.
     * Réinitialise le compteur hebdomadaire si on change de semaine.
     * Met à jour le score anti-gaspi automatiquement.
     */
    addThrownAwayItems: async () => {
        set((state) => ({
            userStats: {
                ...state.userStats,
                thrownAwayItems: state.userStats.thrownAwayItems + 1,
            }
        }));

        const isSameWeekAsLastUpdate = isSameWeek(new Date(), get().lastUpdatedExpiredThisWeek);

        set((state) => ({
            userStats: {
                ...state.userStats,
                expiredThisWeek: isSameWeekAsLastUpdate ? state.userStats.expiredThisWeek + 1 : 1,
            },
            ...(isSameWeekAsLastUpdate ? {} : { lastUpdatedExpiredThisWeek: new Date() }),
        }));


        get().updateAntiWasteScore();
        await get().saveData();
    },
    addConsumptionTime: async (time: number) => {
        set((state) => {
            const newConsumptionTimes = [...state.consumptionTimes, time];
            const newAverage = newConsumptionTimes.length > 0 ?
                Math.round(newConsumptionTimes.reduce((a, b) => a + b, 0) / newConsumptionTimes.length)
                : 0;

            return {
                consumptionTimes: newConsumptionTimes,
                userStats: {
                    ...state.userStats,
                    averageConsumptionTime: newAverage,
                }
            };
        });
        await get().saveData();
    },
    updateAverageConsumptionTime: async () => set((state) => ({
        userStats: {
            ...state.userStats,
            averageConsumptionTime: state.consumptionTimes.length > 0 ?
                Math.round(state.consumptionTimes.reduce((a, b) => a + b, 0) / state.consumptionTimes.length)
                : 0,
        }
    })),
    /**
     * Recalcule le score anti-gaspi basé sur le ratio items jetés / items ajoutés.
     * Score = 100 - (ratio * 100)
     * Ex: 10 items ajoutés, 2 jetés = 100 - (2/10 * 100) = 80 points
     */
    updateAntiWasteScore: () => set((state) => {
        const {totalAddedItems, thrownAwayItems} = state.userStats;
        let newScore = 100;

        if (totalAddedItems > 0) {
            const wasteRatio = thrownAwayItems / totalAddedItems;
            newScore = Math.max(0, 100 - wasteRatio * 100);
        }

        return {
            userStats: {
                ...state.userStats,
                antiWasteScore: Math.round(newScore),
            }
        };
    }),
    addWeeklyAntiWasteScore: async (score: number) => {
        set((state) => ({
            userStats: {
                ...state.userStats,
                antiWasteScoreByWeek: [...state.userStats.antiWasteScoreByWeek, score],
            }
        }));
        await get().saveData();
    },
    resetStats: async (): Promise<void> => {
        set({
            userStats: {
                antiWasteScore: 100,
                totalAddedItems: 0,
                thrownAwayItems: 0,
                expiredThisWeek: 0,
                averageConsumptionTime: 0,
                antiWasteScoreByWeek: [],
            },
            consumptionTimes: [],
        });
        await get().saveData();
    },

    loadData: async () => {
        const [
            userStats,
            consumptionTimes,
            lastUpdatedExpiredThisWeek,
        ] = await Promise.all([
            AsyncStorage.getItem('userStats'),
            AsyncStorage.getItem('consumptionTimes'),
            AsyncStorage.getItem('lastUpdatedExpiredThisWeek'),
        ]);

        set(() => ({
            userStats: userStats ? JSON.parse(userStats) : {
                antiWasteScore: 100,
                totalAddedItems: 0,
                thrownAwayItems: 0,
                expiredThisWeek: 0,
                averageConsumptionTime: 0,
                antiWasteScoreByWeek: [],
            },
            consumptionTimes: consumptionTimes ? JSON.parse(consumptionTimes) : [],
            lastUpdatedExpiredThisWeek: lastUpdatedExpiredThisWeek ? new Date(lastUpdatedExpiredThisWeek) : new Date(),
        }));
    },
    saveData: async () => {
        const state = useStats.getState().userStats;
        await Promise.all([
            AsyncStorage.setItem('userStats', JSON.stringify(state)),
            AsyncStorage.setItem('consumptionTimes', JSON.stringify(get().consumptionTimes)),
            AsyncStorage.setItem('lastUpdatedExpiredThisWeek', get().lastUpdatedExpiredThisWeek.toISOString()),
        ]);
    }
}));