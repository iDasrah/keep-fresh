import {Alert, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import Header from "@/components/ui/Header";
import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import {z} from "zod/v4";
import {useRouter} from "expo-router";
import {handleAuthError, validateFormData} from "@/lib/utils";
import {signUpStyles as styles} from "@/assets/style/sign-up.styles";
import {ProgressIndicator, SignUpStep1, SignUpStep2, SignUpStep3} from "@/components/onboarding";
import {useTranslation} from "react-i18next";

type SignUpMethod = 'email' | 'apple' | 'google' | null;

const SignUp = () => {
    const { t, ready } = useTranslation(['common', 'error']);

    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>(null);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    if (!ready) {
        return;
    }

    const signUpSchema = z.object({
        firstname: z.string()
            .nonempty({error: t('signUp.requiredFirstname', { ns: 'error' })})
            .max(20, {error: t('signUp.firstnameTooLong', { ns: 'error' })})
            .regex(/^[a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)*$/, {error: t('signUp.invalidFirstname', { ns: 'error' })}),
        lastname: z.string()
            .nonempty({error: t('signUp.requiredLastname', { ns: 'error' })})
            .max(20, {error: t('signUp.lastnameTooLong', { ns: 'error' })})
            .regex(/^[a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)*$/, {error: t('signUp.invalidLastname', { ns: 'error' })}),
        name: z.string()
            .nonempty({error: t('signUp.requiredName', { ns: 'error' })})
            .max(15, {error: t('signUp.nameTooLong', { ns: 'error' })})
            .regex(/^[_a-z0-9]*$/, {error: t('signUp.invalidName', { ns: 'error' })}),
        email: z.email({error: t('signUp.invalidEmail', { ns: 'error' })}),
        password: z.string()
            .min(8, {error: t('signUp.passwordTooShort', { ns: 'error' })})
            .max(30, {error: t('signUp.passwordTooLong', { ns: 'error' })})
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/gm, {error: t('signUp.invalidPassword', { ns: 'error' })}),
        passwordConfirmation: z.string()
            .min(8, {error: t('signUp.passwordConfirmationTooShort', { ns: 'error' })})
            .max(30, {error: t('signUp.passwordConfirmationTooLong', { ns: 'error' })}),
    });

    const handleSignUp = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const validation = validateFormData(signUpSchema, {
                firstname,
                lastname,
                name,
                email,
                password,
                passwordConfirmation
            });

            if (!validation.success) {
                Alert.alert('', validation.error);
                return;
            }

            if (validation.data.password !== validation.data.passwordConfirmation) {
                Alert.alert('', t('signUp.passwordMismatch', { ns: 'error' }));
                return;
            }

            const { error } = await authClient.signUp.email(validation.data);

            if (error) {
                Alert.alert('', handleAuthError(error));
                return;
            }

            setFirstname("");
            setLastname("");
            setName("");
            setEmail("");
            setPassword("");
            setPasswordConfirmation("");

            router.replace("/(after-auth)/add-first-location");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignUp = async (method: 'apple' | 'google') => {
        Alert.alert('', `Connexion ${method === 'apple' ? 'Apple' : 'Google'} en cours de développement`);
    };

    const handleMethodSelect = (method: SignUpMethod) => {
        setSignUpMethod(method);
        if (method === 'email') {
            setStep(2);
        } else if (method) {
            handleSocialSignUp(method);
        }
    };

    const handleStep2Next = () => {
        // Validation des champs de l'étape 2
        const step2Schema = z.object({
            firstname: signUpSchema.shape.firstname,
            lastname: signUpSchema.shape.lastname,
            name: signUpSchema.shape.name,
        });

        const validation = validateFormData(step2Schema, {firstname, lastname, name});

        if (!validation.success) {
            Alert.alert('', validation.error);
            return;
        }

        setStep(3);
    };

    return (
        <View style={styles.wrapper}>
            <Header variant="back" />

            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <ProgressIndicator currentStep={step} />

                    {step === 1 && (
                        <SignUpStep1 onMethodSelect={handleMethodSelect} />
                    )}

                    {step === 2 && (
                        <SignUpStep2
                            firstname={firstname}
                            lastname={lastname}
                            name={name}
                            onFirstnameChange={setFirstname}
                            onLastnameChange={setLastname}
                            onNameChange={setName}
                            onBack={() => setStep(1)}
                            onNext={handleStep2Next}
                        />
                    )}

                    {step === 3 && (
                        <SignUpStep3
                            email={email}
                            password={password}
                            passwordConfirmation={passwordConfirmation}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onPasswordConfirmationChange={setPasswordConfirmation}
                            onBack={() => setStep(2)}
                            onSubmit={handleSignUp}
                            isLoading={isLoading}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignUp;