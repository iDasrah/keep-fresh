import {Text, View} from "react-native";
import {styles} from "@/assets/style/signup-step3.styles";
import {sharedStyles} from "@/assets/style/shared.styles";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";

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
    return (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{lang.auth.signUp.step3.title}</Text>
                <Text style={styles.subtitle}>
                    {lang.auth.signUp.step3.subtitle}
                </Text>
            </View>

            <View style={styles.formContainer}>
                <View style={sharedStyles.inputField}>
                    <FormLabel>{lang.auth.signUp.step3.email.label}</FormLabel>
                    <FormInput
                        placeholder={lang.auth.signUp.step3.email.placeholder}
                        value={email}
                        onChangeText={onEmailChange}
                        textContentType={"emailAddress"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>

                <View style={sharedStyles.inputField}>
                    <FormLabel>{lang.auth.signUp.step3.password.label}</FormLabel>
                    <FormInput
                        placeholder={lang.auth.signUp.step3.password.placeholder}
                        value={password}
                        onChangeText={onPasswordChange}
                        textContentType="password"
                        secureTextEntry={true}
                        autoComplete="password-new"
                    />
                </View>

                <View style={sharedStyles.inputField}>
                    <FormLabel>{lang.auth.signUp.step3.passwordConfirmation.label}</FormLabel>
                    <FormInput
                        placeholder={lang.auth.signUp.step3.passwordConfirmation.placeholder}
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
                    <Text style={styles.secondaryButtonText}>{lang.back}</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={onSubmit} disabled={isLoading}>
                    <LinearGradient style={[sharedStyles.button, isLoading && styles.buttonDisabled]} colors={colors.blackGradient}>
                        <Text style={sharedStyles.buttonText}>
                            {isLoading ? lang.auth.signUp.step3.loadingBtn : lang.auth.signUp.step3.button}
                        </Text>
                    </LinearGradient>
                </AnimatedPressable>
            </View>
        </View>
    );
}
