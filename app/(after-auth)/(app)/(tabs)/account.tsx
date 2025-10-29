import {Alert, Text, View} from "react-native";
import Header from "@/components/ui/Header";
import {authClient} from "@/lib/auth-client";
import lang from "@/lib/lang";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {useRouter} from "expo-router";
import {getBetterAuthErrorMessage} from "@/lib/utils";
import {sharedStyles} from "@/assets/style/shared.styles";

const SignIn = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();

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
                <View style={{marginTop: 30}}>
                    {/* Se déconnecter */}
                    <AnimatedPressable onPress={handleSignOut}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>{lang.account.disconnect.button}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}

export default SignIn