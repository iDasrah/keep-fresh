import {Platform, Text, View} from "react-native";
import {styles} from "@/assets/style/signup-step1.styles";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import AnimatedLink from "@/components/ui/AnimatedLink";
import {useRouter} from "expo-router";
import lang from "@/lib/lang";

type SignUpMethod = 'email' | 'apple' | 'google';

interface SignUpStep1Props {
    onMethodSelect: (method: SignUpMethod) => void;
}

/**
 * Première étape de l'inscription : Choix de la méthode d'inscription
 * Propose l'inscription par email, Apple (iOS uniquement) ou Google
 */
export default function SignUpStep1({ onMethodSelect }: SignUpStep1Props) {
    const router = useRouter();

    return (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{lang.auth.signUp.step1.title}</Text>
                <Text style={styles.subtitle}>
                    {lang.auth.signUp.step1.subtitle}
                </Text>
            </View>

            <View style={styles.methodsContainer}>
                {/* Email */}
                <AnimatedPressable onPress={() => onMethodSelect('email')}>
                    <View style={styles.methodButton}>
                        <View style={styles.methodIcon}>
                            <Ionicons name="mail" size={24} color={colors.black} />
                        </View>
                        <View style={styles.methodContent}>
                            <Text style={styles.methodTitle}>{lang.auth.signUp.step1.methods.email.title}</Text>
                            <Text style={styles.methodDescription}>
                                {lang.auth.signUp.step1.methods.email.description}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                    </View>
                </AnimatedPressable>

                {/* Apple */}
                {Platform.OS === 'ios' && (
                    <AnimatedPressable onPress={() => onMethodSelect('apple')}>
                        <View style={styles.methodButton}>
                            <View style={styles.methodIcon}>
                                <Ionicons name="logo-apple" size={24} color={colors.black} />
                            </View>
                            <View style={styles.methodContent}>
                                <Text style={styles.methodTitle}>{lang.auth.signUp.step1.methods.apple.title}</Text>
                                <Text style={styles.methodDescription}>
                                    {lang.auth.signUp.step1.methods.apple.description}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                        </View>
                    </AnimatedPressable>
                )}

                {/* Google */}
                <AnimatedPressable onPress={() => onMethodSelect('google')}>
                    <View style={styles.methodButton}>
                        <View style={styles.methodIcon}>
                            <Ionicons name="logo-google" size={24} color={colors.black} />
                        </View>
                        <View style={styles.methodContent}>
                            <Text style={styles.methodTitle}>{lang.auth.signUp.step1.methods.google.title}</Text>
                            <Text style={styles.methodDescription}>
                                {lang.auth.signUp.step1.methods.google.description}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                    </View>
                </AnimatedPressable>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {lang.auth.signUp.step1.alreadyHaveAccount.text} {" "}
                </Text>
                <AnimatedLink
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/sign-in')}
                >
                    <Text style={styles.footerLink}>{lang.auth.signUp.step1.alreadyHaveAccount.action}</Text>
                </AnimatedLink>
            </View>
        </View>
    );
}
