import {Alert, Text, View} from "react-native";
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
import {getBetterAuthErrorMessage} from "@/lib/utils";
import {sharedStyles} from "@/assets/style/shared.styles";
import {useTranslation} from "react-i18next";

const RequestResetPassword = () => {
    const { t, ready } = useTranslation(['common', 'error']);
    const router = useRouter();

    const [email, setEmail] = useState("");

    if (!ready) {
        return;
    }

    const signInSchema = z.object({
        email: z.email({error: t('signIn.invalidEmail', { ns: 'error' })}),
    });

    const handleRequestResetPassword = async () => {
        const parsedItem = signInSchema.safeParse({
            email,
        });

        // Si validation échoue : Affiche le premier message d'erreur
        if (!parsedItem.success) {
            const firstError = parsedItem.error.issues[0]?.message;
            if (firstError) {
                Alert.alert('', firstError);
            } else {
                Alert.alert('', t('generic', { ns: 'error' }));
            }
            return;
        }

        const { error } = await authClient.requestPasswordReset({
            ...parsedItem.data,
        });

        setEmail("");

        if (error) {
            if (!error.code) {
                Alert.alert('', t('generic', { ns: 'error' }));
                return;
            }

            Alert.alert('', getBetterAuthErrorMessage(error.code));
            return;
        }

        if (router.canGoBack()) {
            router.back();
        }
        router.replace("/sign-in");
    };

    return (
        <View>
            <Header variant={"back"}/>

            <View style={sharedStyles.form}>
                {/* Titre de la page */}
                <Text style={sharedStyles.title}>{t('auth.requestResetPassword.title')}</Text>

                <View style={{marginTop: 30}}>
                    {/* Email */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{t('auth.requestResetPassword.form.email.label')}</FormLabel>
                        <FormInput
                            placeholder={t('auth.requestResetPassword.form.email.placeholder')}
                            value={email}
                            onChangeText={setEmail}
                            textContentType={"emailAddress"}
                        />
                    </View>

                    {/* Demande de réinitialisation du mot de passe */}
                    <AnimatedPressable onPress={handleRequestResetPassword}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>{t('auth.requestResetPassword.form.button')}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}

export default RequestResetPassword;