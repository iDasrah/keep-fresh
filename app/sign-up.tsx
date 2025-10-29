import {Alert, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import Header from "@/components/ui/Header";
import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import lang from "@/lib/lang";
import {z} from "zod/v4";
import {useRouter} from "expo-router";
import {handleAuthError, validateFormData} from "@/lib/utils";
import {signUpStyles as styles} from "@/assets/style/sign-up.styles";
import {ProgressIndicator, SignUpStep1, SignUpStep2, SignUpStep3} from "@/components/onboarding";

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

type SignUpMethod = 'email' | 'apple' | 'google' | null;

const SignUp = () => {
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
                Alert.alert('', lang.errors.signUp.passwordMismatch);
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

            router.replace("/(after-auth)/(app)/(tabs)");
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