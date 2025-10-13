import {create} from 'zustand/react';
import {Stats} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StatsState {
    userStats: Stats,

    addTotalAddedItems: () => void;
    addThrownAwayItems: () => void;
    addExpiredThisWeek: () => void;
    updateAverageConsumptionTime: (newTime: number) => void;
    updateAntiWasteScore: () => void;
    addWeeklyAntiWasteScore: (score: number) => void;
    resetStats: () => void;

    loadData: () => void;
    saveData: () => void;
}

export const useStats = create<StatsState>((set) => ({
    userStats: {
        antiWasteScore: 100,
        totalAddedItems: 0,
        thrownAwayItems: 0,
        expiredThisWeek: 0,
        averageConsumptionTime: 0,
        antiWasteScoreByWeek: [],
    },

    addTotalAddedItems: () => set((state) => ({
        userStats: {
            ...state.userStats,
            totalAddedItems: state.userStats.totalAddedItems++,
        }
    })),
    addThrownAwayItems: () => set((state) => ({
        userStats: {
            ...state.userStats,
            thrownAwayItems: state.userStats.thrownAwayItems++,
        }
    })),
    addExpiredThisWeek: () => set((state) => ({
        userStats: {
            ...state.userStats,
            expiredThisWeek: state.userStats.expiredThisWeek++,
        }
    })),
    updateAverageConsumptionTime: (newTime: number) => set((state) => ({})),
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
    addWeeklyAntiWasteScore: (score: number) => set((state) => ({
        userStats: {
            ...state.userStats,
            antiWasteScoreByWeek: [...state.userStats.antiWasteScoreByWeek, score],
        }
    })),
    resetStats: () => set(() => ({
        userStats: {
            antiWasteScore: 100,
            totalAddedItems: 0,
            thrownAwayItems: 0,
            expiredThisWeek: 0,
            averageConsumptionTime: 0,
            antiWasteScoreByWeek: [],
        }
    })),

    loadData: async () => {
        const [
            antiWasteScore,
            totalAddedItems,
            thrownAwayItems,
            expiredThisWeek,
            averageConsumptionTime,
            antiWasteScoreByWeek,
        ] = await Promise.all([
            AsyncStorage.getItem('antiWasteScore'),
            AsyncStorage.getItem('totalAddedItems'),
            AsyncStorage.getItem('thrownAwayItems'),
            AsyncStorage.getItem('expiredThisWeek'),
            AsyncStorage.getItem('averageConsumptionTime'),
            AsyncStorage.getItem('antiWasteScoreByWeek'),
        ]);

        set(() => ({
            userStats: {
                antiWasteScore: antiWasteScore ? parseInt(antiWasteScore) : 100,
                totalAddedItems: totalAddedItems ? parseInt(totalAddedItems) : 0,
                thrownAwayItems: thrownAwayItems ? parseInt(thrownAwayItems) : 0,
                expiredThisWeek: expiredThisWeek ? parseInt(expiredThisWeek) : 0,
                averageConsumptionTime: averageConsumptionTime ? parseInt(averageConsumptionTime) : 0,
                antiWasteScoreByWeek: antiWasteScoreByWeek ? JSON.parse(antiWasteScoreByWeek) : [],
            }
        }));
    },
    saveData: async () => {
        const state = useStats.getState().userStats;
        await Promise.all([
            AsyncStorage.setItem('antiWasteScore', state.antiWasteScore.toString()),
            AsyncStorage.setItem('totalAddedItems', state.totalAddedItems.toString()),
            AsyncStorage.setItem('thrownAwayItems', state.thrownAwayItems.toString()),
            AsyncStorage.setItem('expiredThisWeek', state.expiredThisWeek.toString()),
            AsyncStorage.setItem('averageConsumptionTime', state.averageConsumptionTime.toString()),
            AsyncStorage.setItem('antiWasteScoreByWeek', JSON.stringify(state.antiWasteScoreByWeek)),
        ]);
    }
}));