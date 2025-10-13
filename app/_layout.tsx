import { Stack } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {colors} from "@/constants/colors";
import {StatusBar} from "expo-status-bar";
import {useEffect} from "react";
import { useDatabase } from "@/stores/database";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {requestPermissionsAsync, setNotificationHandler} from "expo-notifications";
import {handler} from "@/lib/notifications";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useStats} from "@/stores/stats";
import {useSettings} from "@/stores/settings";

const queryClient = new QueryClient()

setNotificationHandler({
    handleNotification: handler
});

export default function RootLayout() {
    const { init, getAllItems, isConnected, isConnecting } = useDatabase();
    const { loadData } = useStats();
    const { loadSettings } = useSettings();

    useEffect(() => {
        const initApp = async () => {
            await Promise.all([
                init(),
                requestPermissionsAsync(),
                loadSettings(),
                loadData()
            ])
        }
        initApp();
    }, [getAllItems, init, isConnected, isConnecting, loadData, loadSettings]);

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1, backgroundColor: colors.black}} edges={['top', 'right', 'left']}>
                    <StatusBar style="light" />
                    <QueryClientProvider client={queryClient}>
                        <Stack screenOptions={{headerShown: false}}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="add-item" />
                        </Stack>
                    </QueryClientProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
