import { Stack } from "expo-router";
import {useEffect} from "react";
import { useDatabase } from "@/stores/database";
import {requestPermissionsAsync, setNotificationHandler} from "expo-notifications";
import {handler} from "@/lib/notifications";
import {useStats} from "@/stores/stats";
import {useSettings} from "@/stores/settings";

setNotificationHandler({
    handleNotification: handler
});

export default function AppLayout() {
    const { init } = useDatabase();
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
    }, [init, loadData, loadSettings]);

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-item/[productId]" />
        </Stack>
    );
}
