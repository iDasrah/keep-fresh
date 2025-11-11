import {View, Text, Platform, Alert} from 'react-native'
import {useState, useCallback} from 'react'
import Header from "@/components/ui/Header";
import FormLabel from "@/components/ui/FormLabel";
import {styles} from "@/assets/style/add-item.styles";
import {colors} from "@/constants/colors";
import SelectorInput from "@/components/ui/SelectorInput";
import {LinearGradient} from "expo-linear-gradient";
import RNDateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {z} from "zod/v4";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {addDays} from "date-fns";
import {useApiMutation} from "@/hooks/useApiMutation";
import {api} from "@/lib/api";
import {AxiosError} from "axios";
import {CreateLocationProductDto, Product} from "@/generated-api";
import {useLocation} from "@/hooks/useLocation";
import FormInput from "@/components/ui/FormInput";
import {Storage} from "@/types";
import {useTranslation} from "react-i18next";
import {getLocales} from "expo-localization";

/**
 * SCREEN : Formulaire d'ajout d'un produit
 *
 * FORMULAIRE COMPLET avec 5 champs :
 * 1. Nom du produit (TextInput)
 * 2. Quantité (SelectorInput) - Options dynamiques selon l'unité
 * 3. Unité (SelectorInput) - pcs, kg, g, L, mL, etc.
 * 4. Date d'expiration (DateTimePicker) - Minimum demain
 * 5. Stockage (SelectorInput) - frigo/congélateur/placards
 *
 * FLOW APRÈS AJOUT :
 * 1. Validation Zod stricte (tous les champs requis)
 * 2. Insertion SQLite (retourne l'ID du nouvel item)
 * 3. Schedule des notifications (expired + soon expired)
 * 4. Incrémente le compteur stats (totalAddedItems)
 * 5. Reset du formulaire + redirect vers "/"
 *
 * FEATURES :
 * - Placeholder aléatoire selon le type de stockage (ex: "Lait" pour frigo)
 * - Options de quantité adaptées à l'unité (ex: 100-1000 pour grammes)
 * - Pré-remplissage du storage si passé en query param (?storage=fridge)
 */

/**
 * Schema Zod pour valider TOUT le formulaire avant soumission.
 * - name : string non vide (min 1 caractère)
 * - quantity : nombre positif (min 1)
 * - unit : string non vide
 * - storage : enum strict (3 valeurs possibles)
 * - expirationDate : Date dans le futur (refine custom)
 */
const itemSchema = z.object({
    quantity: z.number().min(1),
    storage: z.enum(Storage),
    expirationDate: z.date().refine(date => date > new Date()),
});

/**
 * Schema Zod pour valider le query param ?storage=...
 * Permet de pré-sélectionner le type de stockage depuis la page d'accueil.
 */
const storageParamSchema = z.enum(Storage);

const AddItem = () => {
    const { t, ready } = useTranslation(['common', 'error']);
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [product, setProduct] = useState<Product>({} as Product);
    const { location } = useLocation();

    const getProductV1 = useApiMutation((data: string) => api.product.getProductV1(data));
    const createLocationProductV1 = useApiMutation(({locationId, data}: {locationId: string, data: CreateLocationProductDto}) => api.locationProduct.createLocationProductV1(locationId, data));

    useFocusEffect(
        useCallback(() => {
            const fetchProduct = async (productId: string) => {
                try {
                    const scannedProduct = await getProductV1.mutateAsync(productId);

                    if (!location) {
                        Alert.alert('Error', t('generic', { ns: 'error' }));
                        return;
                    }
                    setProduct(scannedProduct.data);
                } catch (error: unknown) {
                    if (error instanceof AxiosError && error.response?.data?.message) {
                        Alert.alert('Error', error.response.data.message);
                        return;
                    }
                    Alert.alert('Error', t('generic', { ns: 'error' }));
                }
            }

            void fetchProduct(productId);
        }, [])
    );

    // Récupère le query param ?storage=... (optionnel)
    const { storage: storageParam } = useLocalSearchParams<{ storage: Storage }>();

    // États locaux pour chaque champ du formulaire
    const [quantity, setQuantity] = useState("1");

    /**
     * État storage avec pré-remplissage intelligent :
     * - Si storageParam existe ET est valide (fridge/freezer/pantry) : pré-sélectionne
     * - Sinon : défaut = fridge
     * Permet de garder le contexte quand l'utilisateur clique "+" depuis un storage spécifique
     */
    const [storage, setStorage] = useState<{label: string, value: string}>(
        storageParam && storageParamSchema.safeParse(storageParam).success
            ? {label: t(`header.storageSelector.${storageParam}`), value: storageParam as string}
            : {label: t('header.storageSelector.FRIDGE'), value: "FRIDGE"}
    );

    // Date d'expiration par défaut = demain (addDays évite d'ajouter des produits déjà expirés)
    const [expirationDate, setExpirationDate] = useState<Date>(addDays(new Date(), 1));

    const router = useRouter();

    if (!ready) {
        return;
    }

    // Options pour le sélecteur de stockage
    const storageOptions = [
        {label: t('header.storageSelector.FRIDGE'), value: "FRIDGE"},
        {label: t('header.storageSelector.FREEZER'), value: "FREEZER"},
        {label: t('header.storageSelector.PANTRY'), value: "PANTRY"},
        {label: t('header.storageSelector.OTHER'), value: "OTHER"},
    ];

    /**
     * Handler de soumission du formulaire.
     *
     * ÉTAPES :
     * 1. Validation Zod de TOUS les champs
     * 2. Si erreur : Affiche la première erreur rencontrée
     * 3. Si succès :
     *    a. Insertion SQLite (addItem retourne l'ID)
     *    b. Schedule 2 notifications (expired + soon expired)
     *    c. Incrémente totalAddedItems dans les stats
     *    d. Reset du formulaire
     *    e. Redirect vers l'accueil
     */
    const handleAddItem = async () => {
        try {
            if (!location) {
                Alert.alert('Error', t('generic', { ns: 'error' }));
                return;
            }

            // Validation Zod avec safeParse (ne throw pas, retourne un objet result)
            const parsedItem = itemSchema.safeParse({
                quantity: Number(quantity),
                storage: storage.value as Storage,
                expirationDate,
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

            await createLocationProductV1.mutateAsync({
                locationId: location,
                data: {
                    productId: product.id,
                    containerType: parsedItem.data.storage,
                    quantity: parsedItem.data.quantity,
                    expirationDate: parsedItem.data.expirationDate.toISOString(),
                },
            });

            // Reset complet du formulaire
            setQuantity("1");
            setStorage({label: t('header.storageSelector.FRIDGE'), value: "FRIDGE"});
            setExpirationDate(new Date());

            // Retour à l'accueil (replace pour éviter de garder /add-item dans l'historique)
            router.replace("/");
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.message) {
                if (typeof error.response.data.message === 'string') {
                    Alert.alert('Error', error.response.data.message);
                    return;
                } else if (Array.isArray(error.response.data.message)
                    && error.response.data.message.length > 0
                    && error.response.data.message[0]?.constraints
                ) {
                    Alert.alert('Error', Object.values(error.response.data.message[0].constraints)[0] as string);
                    return;
                }
            }
            Alert.alert('Error', t('generic', { ns: 'error' }));
        }
    }

    return (
        <View>
            {/* Header avec bouton retour */}
            <Header variant="back" />

            <View style={styles.addItem}>
                {/* Titre et sous-titre de la page */}
                <Text style={styles.title}>{t('addItem.title')}{" "}{product.name}</Text>
                <Text style={styles.subtitle}>{t('addItem.subtitle')}</Text>

                <View style={{marginTop: 30}}>
                    {/* CHAMPS 2 & 3 : Quantité et Unité (côte à côte) */}
                    <View style={[styles.inputField, {flexDirection: "row", gap: 12}]}>
                        <View style={{flex: 1}}>
                            <FormLabel>{t('addItem.form.quantity.label')}</FormLabel>
                            <FormInput
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                accessibilityLabel="Quantity input"
                                accessibilityHint="Enter the quantity of the product"
                            />
                        </View>
                    </View>

                    {/* CHAMP 4 : Date d'expiration (DateTimePicker natif iOS/Android) */}
                    <View style={styles.inputField}>
                        <FormLabel>{t('addItem.form.expirationDate.label')}</FormLabel>
                        { Platform.OS === "ios" ? (
                            <RNDateTimePicker
                                value={expirationDate}
                                onChange={(_, date) => setExpirationDate(date!)}
                                minimumDate={addDays(new Date(), 1)} // Minimum = demain
                            />
                        ) : (
                            <AnimatedPressable
                                onPress={() => DateTimePickerAndroid.open({
                                    value: expirationDate,
                                    onChange: (_, date) => date && setExpirationDate(date),
                                    minimumDate: addDays(new Date(), 1),
                                    mode: "date",
                                })}
                                style={styles.androidDatePicker}
                            >
                                <View style={styles.androidDatePickerContent}>
                                    <Text style={styles.androidDatePickerText}>
                                        {expirationDate.toLocaleDateString(getLocales()[0]?.languageCode ?? 'en', {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </Text>
                                </View>
                            </AnimatedPressable>
                        )
                        }
                    </View>

                    {/* CHAMP 5 : Stockage (frigo/congélateur/placards) */}
                    <View style={styles.inputField}>
                        <FormLabel>{t('addItem.form.storage.label')}</FormLabel>
                        <SelectorInput
                            items={storageOptions}
                            selectedItem={storage}
                            onSelectItem={setStorage}
                        />
                    </View>

                    {/* BOUTON SUBMIT : Ajoute le produit */}
                    <AnimatedPressable onPress={handleAddItem}>
                        <LinearGradient style={styles.addBtn} colors={colors.blackGradient}>
                            <Text style={styles.addBtnText}>{t('addItem.form.addButton')}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}
export default AddItem
