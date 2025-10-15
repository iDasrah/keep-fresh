import {create} from 'zustand/react';
import {Stats} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StatsState {
    userStats: Stats,

    consumptionTimes: number[],

    addTotalAddedItems: () => void;
    addThrownAwayItems: () => void;
    addConsumptionTime: (time: number) => void;
    addExpiredThisWeek: () => void;
    updateAverageConsumptionTime: () => Promise<void>;
    updateAntiWasteScore: () => void;
    addWeeklyAntiWasteScore: (score: number) => void;
    resetStats: () => Promise<void>;

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
    addThrownAwayItems: async () => {
        set((state) => ({
            userStats: {
                ...state.userStats,
                thrownAwayItems: state.userStats.thrownAwayItems + 1,
            }
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
    addExpiredThisWeek: async () => {
        set((state) => ({
            userStats: {
                ...state.userStats,
                expiredThisWeek: state.userStats.expiredThisWeek + 1,
            }
        }));
        get().updateAntiWasteScore();
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
    resetStats: () => {
        return new Promise<void>(async (resolve) => {
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
            resolve();
        });
    },

    loadData: async () => {
        const [
            antiWasteScore,
            totalAddedItems,
            thrownAwayItems,
            expiredThisWeek,
            averageConsumptionTime,
            antiWasteScoreByWeek,
            consumptionTimes
        ] = await Promise.all([
            AsyncStorage.getItem('antiWasteScore'),
            AsyncStorage.getItem('totalAddedItems'),
            AsyncStorage.getItem('thrownAwayItems'),
            AsyncStorage.getItem('expiredThisWeek'),
            AsyncStorage.getItem('averageConsumptionTime'),
            AsyncStorage.getItem('antiWasteScoreByWeek'),
            AsyncStorage.getItem('consumptionTimes'),
        ]);

        set(() => ({
            userStats: {
                antiWasteScore: antiWasteScore ? parseInt(antiWasteScore) : 100,
                totalAddedItems: totalAddedItems ? parseInt(totalAddedItems) : 0,
                thrownAwayItems: thrownAwayItems ? parseInt(thrownAwayItems) : 0,
                expiredThisWeek: expiredThisWeek ? parseInt(expiredThisWeek) : 0,
                averageConsumptionTime: averageConsumptionTime ? parseInt(averageConsumptionTime) : 0,
                antiWasteScoreByWeek: antiWasteScoreByWeek ? JSON.parse(antiWasteScoreByWeek) : [],
            },
            consumptionTimes: consumptionTimes ? JSON.parse(consumptionTimes) : [],
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
            AsyncStorage.setItem('consumptionTimes', JSON.stringify(get().consumptionTimes)),
        ]);
    }
}));