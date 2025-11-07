import { Stack } from "expo-router";
import {useEffect} from "react";
import {requestPermissionsAsync, setNotificationHandler} from "expo-notifications";
import {handler} from "@/lib/notifications";

setNotificationHandler({
    handleNotification: handler
});

export default function AppLayout() {

    useEffect(() => {
        const initApp = async () => {
            await requestPermissionsAsync();
        }
        void initApp();
    }, []);

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-item/[productId]" />
        </Stack>
    );
}
