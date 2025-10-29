import {Text, View} from "react-native";
import {styles} from "@/assets/style/signup-step2.styles";
import {sharedStyles} from "@/assets/style/shared.styles";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";

interface SignUpStep2Props {
    firstname: string;
    lastname: string;
    name: string;
    onFirstnameChange: (value: string) => void;
    onLastnameChange: (value: string) => void;
    onNameChange: (value: string) => void;
    onBack: () => void;
    onNext: () => void;
}

/**
 * Deuxième étape de l'inscription : Informations personnelles
 * Collecte le prénom, nom et nom d'utilisateur
 */
export default function SignUpStep2({
    firstname,
    lastname,
    name,
    onFirstnameChange,
    onLastnameChange,
    onNameChange,
    onBack,
    onNext,
}: SignUpStep2Props) {
    return (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{lang.auth.signUp.step2.title}</Text>
                <Text style={styles.subtitle}>
                    {lang.auth.signUp.step2.subtitle}
                </Text>
            </View>

            <View style={styles.formContainer}>
                <View style={[sharedStyles.inputField, styles.rowInputs]}>
                    <View style={{flex: 1}}>
                        <FormLabel>{lang.auth.signUp.step2.firstName.label}</FormLabel>
                        <FormInput
                            placeholder={lang.auth.signUp.step2.firstName.placeholder}
                            value={firstname}
                            onChangeText={onFirstnameChange}
                            textContentType={"givenName"}
                            autoComplete={"given-name"}
                        />
                    </View>

                    <View style={{flex: 1}}>
                        <FormLabel>{lang.auth.signUp.step2.lastName.label}</FormLabel>
                        <FormInput
                            placeholder={lang.auth.signUp.step2.lastName.placeholder}
                            value={lastname}
                            onChangeText={onLastnameChange}
                            textContentType={"familyName"}
                            autoComplete={"family-name"}
                        />
                    </View>
                </View>

                <View style={sharedStyles.inputField}>
                    <FormLabel>{lang.auth.signUp.step2.username.label}</FormLabel>
                    <FormInput
                        placeholder={lang.auth.signUp.step2.username.placeholder}
                        value={name}
                        onChangeText={onNameChange}
                        textContentType={"username"}
                        autoCapitalize="none"
                        autoComplete="username"
                    />
                </View>
            </View>

            <View style={styles.buttonsContainer}>
                <AnimatedPressable onPress={onBack} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>{lang.back}</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={onNext}>
                    <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                        <Text style={sharedStyles.buttonText}>{lang.continue}</Text>
                    </LinearGradient>
                </AnimatedPressable>
            </View>
        </View>
    );
}
