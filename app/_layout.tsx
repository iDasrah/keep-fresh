import { Stack } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {colors} from "@/constants/colors";
import {StatusBar} from "expo-status-bar";
import {useEffect} from "react";
import { useDatabase } from "@/stores/database";

export default function RootLayout() {
    const { init, getAllItems, isConnected, isConnecting } = useDatabase();

    useEffect(() => {
        if (!isConnected && !isConnecting) {
            console.log("Initializing database...");
            init()
                .then(() => getAllItems().then((items) => console.log("Database initialized with", items.length, "items")))
                .catch(console.error);
        }
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, backgroundColor: colors.black}} edges={['top', 'right', 'left']}>
                <StatusBar style="light" />
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
