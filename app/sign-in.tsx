import {Alert, KeyboardAvoidingView, Platform, Text, View} from "react-native";
import Header from "@/components/ui/Header";
import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {z} from "zod/v4";
import {useRouter} from "expo-router";
import AnimatedLink from "@/components/ui/AnimatedLink";
import {handleAuthError, validateFormData} from "@/lib/utils";
import {sharedStyles} from "@/assets/style/shared.styles";
import {useTranslation} from "react-i18next";

const SignIn = () => {
    const { t, ready } = useTranslation(['common', 'error']);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!ready) {
        return;
    }

    const signInSchema = z.object({
        email: z.email({error: t('signIn.invalidEmail', { ns: 'error' })}),
        password: z.string().min(1, {error: t('signIn.requiredPassword', { ns: 'error' })}),
    });

    const handleSignIn = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const validation = validateFormData(signInSchema, { email, password });

            if (!validation.success) {
                Alert.alert('', validation.error);
                return;
            }

            const { error } = await authClient.signIn.email(validation.data);

            if (error) {
                Alert.alert('', handleAuthError(error));
                return;
            }

            setEmail("");
            setPassword("");
            router.replace("/(after-auth)/(app)/(tabs)");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{flex: 1}}>
            <Header variant="back" />

            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <View style={sharedStyles.form}>
                {/* Titre de la page */}
                <Text style={sharedStyles.title}>{t('auth.signIn.title')}</Text>

                <View style={{marginTop: 30}}>
                    {/* Email */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{t('auth.signIn.form.email.label')}</FormLabel>
                        <FormInput
                            placeholder={t('auth.signIn.form.email.placeholder')}
                            value={email}
                            onChangeText={setEmail}
                            textContentType={"emailAddress"}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            accessibilityLabel="Email address"
                            accessibilityHint="Enter your email address to sign in"
                        />
                    </View>

                    {/* Mot de passe */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{t('auth.signIn.form.password.label')}</FormLabel>
                        <FormInput
                            placeholder={t('auth.signIn.form.password.placeholder')}
                            value={password}
                            onChangeText={setPassword}
                            textContentType={"password"}
                            secureTextEntry={true}
                            autoComplete="password"
                            accessibilityLabel="Password"
                            accessibilityHint="Enter your password to sign in"
                        />
                    </View>

                    {/* Se connecter */}
                    <AnimatedPressable onPress={handleSignIn} disabled={isLoading} style={{marginBottom: 32}}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>
                                {isLoading ? t('auth.signIn.form.loadingBtn') : t('auth.signIn.form.button')}
                            </Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>

                {/* S'inscrire / Mot de passe oublié */}
                <View style={{justifyContent: 'center', alignItems: "center", gap: 8}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: colors.textMuted}}>
                            {t('auth.signIn.noAccountYet.text')}{" "}
                        </Text>
                        <AnimatedLink
                            onPress={() => router.push('/sign-up')}
                        >
                            <Text style={sharedStyles.link}>{t('auth.signIn.noAccountYet.action')}</Text>
                        </AnimatedLink>
                    </View>

                    <View>
                        <AnimatedLink
                            onPress={() => router.push('/request-reset-password')}
                        >
                            <Text style={sharedStyles.link}>{t('auth.signIn.forgotPassword')}</Text>
                        </AnimatedLink>
                    </View>
                </View>
            </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignIn;