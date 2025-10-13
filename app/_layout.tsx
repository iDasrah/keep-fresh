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

const queryClient = new QueryClient()

setNotificationHandler({
    handleNotification: handler
});

export default function RootLayout() {
    const { init, getAllItems, isConnected, isConnecting } = useDatabase();

    useEffect(() => {
        if (!isConnected && !isConnecting) {
            console.log("Initializing database...");
            init()
                .then(() => getAllItems().then((items) => console.log("Database initialized with", items.length, "items")))
                .catch(console.error);
        }
        requestPermissionsAsync().then(({status}) => {
            if (status !== 'granted') {
                console.log('Notification permissions not granted!');
            }
        });
    }, [getAllItems, init, isConnected, isConnecting]);

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
