import {Alert, Text, View} from "react-native";
import Header from "@/components/ui/Header";
import {useState} from "react";
import FormLabel from "@/components/ui/FormLabel";
import lang from "@/lib/lang";
import FormInput from "@/components/ui/FormInput";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "@/constants/colors";
import {z} from "zod/v4";
import {useRouter} from "expo-router";
import {sharedStyles} from "@/assets/style/shared.styles";
import {useApiMutation} from "@/hooks/useApiMutation";
import {api} from "@/lib/api";
import {CreateLocationDto} from "@/generated-api";
import {AxiosError} from "axios";
import {useLocation} from "@/hooks/useLocation";

const addLocationSchema = z.object({
    name: z.string({error: lang.errors.addLocation.invalidName}),
});

const AddFirstLocation = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const { setLocation } = useLocation();

    const createLocationV1 = useApiMutation((data: CreateLocationDto) => api.location.createLocationV1(data));

    const handleAddLocation = async () => {
        const parsedLocation = addLocationSchema.safeParse({
            name,
        });

        // Si validation échoue : Affiche le premier message d'erreur
        if (!parsedLocation.success) {
            const firstError = parsedLocation.error.issues[0]?.message;
            if (firstError) {
                Alert.alert('', firstError);
            } else {
                Alert.alert('', lang.errors.generic);
            }
            return;
        }

        try {
            const locationCreated = await createLocationV1.mutateAsync({
                name: parsedLocation.data.name,
            });
            setLocation(locationCreated.data.id);
            setName("");

            router.replace("/");
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.message) {
                Alert.alert('Error', error.response.data.message);
                return;
            }
            Alert.alert('Error', lang.errors.generic);
        }
    };

    return (
        <View>
            <Header />

            <View style={sharedStyles.form}>
                {/* Titre de la page */}
                <Text style={sharedStyles.title}>{lang.addLocation.title}</Text>

                <View style={{marginTop: 30}}>
                    {/* Nom */}
                    <View style={sharedStyles.inputField}>
                        <FormLabel>{lang.addLocation.form.name.label}</FormLabel>
                        <FormInput
                            placeholder={lang.addLocation.form.name.placeholder}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Créer */}
                    <AnimatedPressable onPress={handleAddLocation}>
                        <LinearGradient style={sharedStyles.button} colors={colors.blackGradient}>
                            <Text style={sharedStyles.buttonText}>{lang.addLocation.form.button}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}

export default AddFirstLocation;