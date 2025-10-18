import { Stack } from 'expo-router';
import {authClient} from "@/lib/auth-client";
import {colors} from "@/constants/colors";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

export default function Root() {
    const session = authClient.useSession();

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1, backgroundColor: colors.black}} edges={['top', 'right', 'left']}>
                    <StatusBar style="light" />
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Protected guard={!!session?.data?.session}>
                            <Stack.Screen name="(app)" />
                        </Stack.Protected>

                        <Stack.Protected guard={!session?.data?.session}>
                            <Stack.Screen name="sign-in" />
                            <Stack.Screen name="sign-up" />
                            <Stack.Screen name="request-reset-password" />
                        </Stack.Protected>
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
