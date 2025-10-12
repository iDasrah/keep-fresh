import { Stack } from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {colors} from "@/constants/colors";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
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
