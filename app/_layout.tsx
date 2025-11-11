import {SplashScreen, Stack} from 'expo-router';
import {authClient} from "@/lib/auth-client";
import {colors} from "@/constants/colors";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {LocationProvider} from "@/hooks/useLocation";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
        }

        const projectId: string|undefined = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            return;
        }

        try {
            return (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
        } catch (_) {
            return;
        }
    } else {
        return;
    }
}

export default function AuthLayout() {
    SplashScreen.preventAutoHideAsync();
    const session = authClient.useSession();
    const queryClient = new QueryClient();

    if (!session.isPending) {
        const pushToken = (session.data?.user as any)?.expoPushToken as string|undefined;
        if (session.data?.session && !pushToken) {
            registerForPushNotificationsAsync().then(async (token) => {
                if (token) {
                    await authClient.updateUser({
                        expoPushToken: token,
                    } as any);
                }
            });
        } else if (session.data?.session && pushToken) {
            Notifications.getPermissionsAsync().then(async ({ status }) => {
                if (status !== 'granted') {
                    await authClient.updateUser({
                        expoPushToken: null,
                    } as any);
                }
            });
        }
        SplashScreen.hide();
    }

    return (
        <GestureHandlerRootView>
            <QueryClientProvider client={queryClient}>
                <LocationProvider>
                    <SafeAreaProvider>
                        <SafeAreaView style={{flex: 1, backgroundColor: colors.black}} edges={['top', 'right', 'left']}>
                            <StatusBar style="light" />
                            <Stack screenOptions={{headerShown: false}}>
                                <Stack.Protected guard={!!session?.data?.session}>
                                    <Stack.Screen name="(after-auth)" />
                                </Stack.Protected>

                                <Stack.Protected guard={!session?.data?.session}>
                                    <Stack.Screen name="index" />
                                    <Stack.Screen name="sign-in" />
                                    <Stack.Screen name="sign-up" />
                                    <Stack.Screen name="request-reset-password" />
                                </Stack.Protected>
                            </Stack>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </LocationProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
