import {Text, View} from "react-native";
import {styles} from "@/assets/style/signup-step3.styles";
import {sharedStyles} from "@/assets/style/shared.styles";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useTranslation} from "react-i18next";

interface SignUpStep3Props {
    email: string;
    password: string;
    passwordConfirmation: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onPasswordConfirmationChange: (value: string) => void;
    onBack: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

/**
 * Troisième étape de l'inscription : Sécurisation du compte
 * Collecte l'email et le mot de passe
 */
export default function SignUpStep3({
    email,
    password,
    passwordConfirmation,
    onEmailChange,
    onPasswordChange,
    onPasswordConfirmationChange,
    onBack,
    onSubmit,
    isLoading,
}: SignUpStep3Props) {
    const { t, ready } = useTranslation();

    if (!ready) {
        return;
    }

    return (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('auth.signUp.step3.title')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.signUp.step3.subtitle')}
                </Text>
            </View>

            <View style={styles.formContainer}>
                <View style={sharedStyles.inputField}>
                    <FormLabel>{t('auth.signUp.step3.email.label')}</FormLabel>
                    <FormInput
                        placeholder={t('auth.signUp.step3.email.placeholder', { appName: String(process.env.EXPO_PUBLIC_APP_NAME).replace(/\s+/g, '').toLowerCase() })}
                        value={email}
                        onChangeText={onEmailChange}
                        textContentType={"emailAddress"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>

                <View style={sharedStyles.inputField}>
                    <FormLabel>{t('auth.signUp.step3.password.label')}</FormLabel>
                    <FormInput
                        placeholder={t('auth.signUp.step3.password.placeholder')}
                        value={password}
                        onChangeText={onPasswordChange}
                        textContentType="password"
                        secureTextEntry={true}
                        autoComplete="password-new"
                    />
                </View>

                <View style={sharedStyles.inputField}>
                    <FormLabel>{t('auth.signUp.step3.passwordConfirmation.label')}</FormLabel>
                    <FormInput
                        placeholder={t('auth.signUp.step3.passwordConfirmation.placeholder')}
                        value={passwordConfirmation}
                        onChangeText={onPasswordConfirmationChange}
                        textContentType="password"
                        secureTextEntry={true}
                        autoComplete="password-new"
                    />
                </View>
            </View>

            <View style={styles.buttonsContainer}>
                <AnimatedPressable onPress={onBack} style={styles.secondaryButton} disabled={isLoading}>
                    <Text style={styles.secondaryButtonText}>{t('back')}</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={onSubmit} disabled={isLoading}>
                    <LinearGradient style={[sharedStyles.button, isLoading && styles.buttonDisabled]} colors={colors.blackGradient}>
                        <Text style={sharedStyles.buttonText}>
                            {isLoading ? t('auth.signUp.step3.loadingBtn') : t('auth.signUp.step3.button')}
                        </Text>
                    </LinearGradient>
                </AnimatedPressable>
            </View>
        </View>
    );
}
