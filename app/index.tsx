import {Text, View} from 'react-native'
import React from 'react'
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/root.styles";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {sharedStyles} from "@/assets/style/shared.styles";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";

const Index = () => {
    const { t, ready } = useTranslation();
    const router = useRouter();

    if (!ready) {
        return;
    }

    return (
        <View style={styles.wrapper}>
            <Header />
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.title}>
                            {t('auth.root.welcomeTitle')}{'\n'}
                            <Text style={styles.titleBrand}>
                                {process.env.EXPO_PUBLIC_APP_NAME}<Text style={styles.titleAccent}>.</Text>
                            </Text>
                        </Text>
                        <Text style={styles.subtitle}>
                            {t('auth.root.subtitle')}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <AnimatedPressable onPress={() => router.push('/sign-in')}>
                            <LinearGradient colors={colors.blackGradient} style={sharedStyles.button}>
                                <Text style={sharedStyles.buttonText}>{t('auth.root.actions.signIn')}</Text>
                            </LinearGradient>
                        </AnimatedPressable>
                        <AnimatedPressable onPress={() => router.push('/sign-up')}>
                            <LinearGradient colors={colors.blackGradient} style={sharedStyles.button}>
                                <Text style={sharedStyles.buttonText}>{t('auth.root.actions.signUp')}</Text>
                            </LinearGradient>
                        </AnimatedPressable>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default Index
