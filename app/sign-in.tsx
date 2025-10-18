import {Alert, Text, View} from "react-native";
import Header from "@/components/ui/Header";
import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import FormLabel from "@/components/ui/FormLabel";
import lang from "@/lib/lang";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {z} from "zod/v4";
import {useRouter} from "expo-router";
import AnimatedLink from "@/components/ui/AnimatedLink";
import {getBetterAuthErrorMessage} from "@/lib/utils";
import {sharedStyles} from "@/assets/style/shared.styles";

const signInSchema = z.object({
    email: z.email({error: lang.errors.signIn.invalidEmail}),
    password: z.string().min(1, {error: lang.errors.signIn.requiredPassword}),
});

const SignIn = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        const parsedItem = signInSchema.safeParse({
            email,
            password,
        });

        // Si validation échoue : Affiche le premier message d'erreur
        if (!parsedItem.success) {
            const firstError = parsedItem.error.issues[0]?.message;
            if (firstError) {
                Alert.alert('', firstError);
            } else {
                Alert.alert('', lang.errors.generic);
            }
            return;
        }

        const { error } = await authClient.signIn.email({
            ...parsedItem.data,
        });

        setEmail("");
        setPassword("");

        if (error) {
            if (!error.code) {
                Alert.alert('', lang.errors.generic);
                return;
            }

            Alert.alert('', getBetterAuthErrorMessage(error.code));
            return;
        }

        router.replace("/");
    };

    return (
        <View>
            <Header />

            <View style={sharedStyles.form}>
                {/* Titre de la page */}
                <Text style={sharedStyles.title}>{lang.account.signIn.title}</Text>

                <View style={{marginTop: 30}}>
                    {/* Email */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signIn.form.email.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signIn.form.email.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            textContentType={"emailAddress"}
                        />
                    </View>

                    {/* Mot de passe */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signIn.form.password.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signIn.form.password.placeholder}
                            value={password}
                            onChangeText={setPassword}
                            textContentType={"password"}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Se connecter */}
                    <AnimatedPressable onPress={handleSignIn}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>{lang.account.signIn.form.button}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>

                {/* S'inscrire / Mot de passe oublié */}
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text>
                        {lang.account.signIn.noAccountYet.text}{" "}
                    </Text>
                    <AnimatedLink
                        onPress={() => router.push('/sign-up')}
                    >
                        <Text style={sharedStyles.link}>{lang.account.signIn.noAccountYet.action}</Text>
                    </AnimatedLink>
                </View>

                <View>
                    <AnimatedLink
                        onPress={() => router.push('/request-reset-password')}
                    >
                        <Text style={sharedStyles.link}>{lang.account.signIn.forgotPassword}</Text>
                    </AnimatedLink>
                </View>
            </View>
        </View>
    )
}

export default SignIn;