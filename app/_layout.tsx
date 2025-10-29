import {SplashScreen, Stack} from 'expo-router';
import {authClient} from "@/lib/auth-client";
import {colors} from "@/constants/colors";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {LocationProvider} from "@/providers/location";

export default function AuthLayout() {
    SplashScreen.preventAutoHideAsync();
    const session = authClient.useSession();
    const queryClient = new QueryClient();

    if (!session.isPending) {
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
