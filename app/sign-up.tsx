import {Alert, ScrollView, Text, View} from "react-native";
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

const signUpSchema = z.object({
    firstname: z.string()
        .nonempty({error: lang.errors.signUp.requiredFirstname})
        .max(20, {error: lang.errors.signUp.firstnameTooLong})
        .regex(/^[a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)*$/, {error: lang.errors.signUp.invalidFirstname}),
    lastname: z.string()
        .nonempty({error: lang.errors.signUp.requiredLastname})
        .max(20, {error: lang.errors.signUp.lastnameTooLong})
        .regex(/^[a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)*$/, {error: lang.errors.signUp.invalidLastname}),
    name: z.string()
        .nonempty({error: lang.errors.signUp.requiredName})
        .max(15, {error: lang.errors.signUp.nameTooLong})
        .regex(/^[_a-z0-9]*$/, {error: lang.errors.signUp.invalidName}),
    email: z.email({error: lang.errors.signUp.invalidEmail}),
    password: z.string()
        .min(8, {error: lang.errors.signUp.passwordTooShort})
        .max(30, {error: lang.errors.signUp.passwordTooLong})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/gm, {error: lang.errors.signUp.invalidPassword}),
    passwordConfirmation: z.string()
        .min(8, {error: lang.errors.signUp.passwordConfirmationTooShort})
        .max(30, {error: lang.errors.signUp.passwordConfirmationTooLong}),
});

const SignUp = () => {
    const router = useRouter();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleSignIn = async () => {
        const parsedItem = signUpSchema.safeParse({
            firstname,
            lastname,
            name,
            email,
            password,
            passwordConfirmation
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

        if (parsedItem.data.password !== parsedItem.data.passwordConfirmation) {
            Alert.alert('', lang.errors.signUp.passwordMismatch);
            return;
        }

        const { error } = await authClient.signUp.email({
            ...parsedItem.data,
        });

        if (error) {
            if (!error.code) {
                Alert.alert('', lang.errors.generic);
                return;
            }

            Alert.alert('', getBetterAuthErrorMessage(error.code));
            return;
        }

        setFirstname("");
        setLastname("");
        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");

        router.replace("/(app)/(tabs)");
    };

    return (
        <View>
            <Header />

            <ScrollView
                style={sharedStyles.form}
                contentContainerStyle={{paddingBottom: 200}}
            >
                {/* Titre de la page */}
                <Text style={sharedStyles.title}>{lang.account.signUp.title}</Text>

                <View style={{marginTop: 30}}>
                    <View style={[sharedStyles.inputField, {flexDirection: "row", gap: 12}]}>
                        {/* Prénom */}
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.account.signUp.form.firstname.label}</FormLabel>
                            <FormInput
                                placeholder={lang.account.signUp.form.firstname.placeholder}
                                value={firstname}
                                onChangeText={setFirstname}
                                textContentType={"name"}
                            />
                        </View>

                        {/* Nom */}
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.account.signUp.form.lastname.label}</FormLabel>
                            <FormInput
                                placeholder={lang.account.signUp.form.lastname.placeholder}
                                value={lastname}
                                onChangeText={setLastname}
                                textContentType={"name"}
                            />
                        </View>
                    </View>

                    {/* Nom d'utilisateur */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signUp.form.name.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signUp.form.name.placeholder}
                            value={name}
                            onChangeText={setName}
                            textContentType={"name"}
                        />
                    </View>

                    {/* Email */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signUp.form.email.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signUp.form.email.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            textContentType={"emailAddress"}
                        />
                    </View>

                    {/* Mot de passe */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signUp.form.password.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signUp.form.password.placeholder}
                            value={password}
                            onChangeText={setPassword}
                            textContentType={"password"}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Confirmation de mot de passe */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.account.signUp.form.confirmationPassword.label}</FormLabel>
                        <FormInput
                            placeholder={lang.account.signUp.form.confirmationPassword.placeholder}
                            value={passwordConfirmation}
                            onChangeText={setPasswordConfirmation}
                            textContentType={"password"}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Se connecter */}
                    <AnimatedPressable onPress={handleSignIn}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>{lang.account.signUp.form.button}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>

                {/* Se connecter */}
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text>
                        {lang.account.signUp.alreadyHaveAnAccount.text}{" "}
                    </Text>
                    <AnimatedLink
                        onPress={() => router.canGoBack() ? router.back() : router.replace('/sign-in')}
                    >
                        <Text style={sharedStyles.link}>{lang.account.signUp.alreadyHaveAnAccount.action}</Text>
                    </AnimatedLink>
                </View>
            </ScrollView>
        </View>
    )
}

export default SignUp;