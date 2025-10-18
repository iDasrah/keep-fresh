import {View, Text, Platform, Alert} from 'react-native'
import {useState, useMemo} from 'react'
import Header from "@/components/ui/Header";
import FormInput from "@/components/ui/FormInput";
import FormLabel from "@/components/ui/FormLabel";
import {styles} from "@/assets/style/add-item.styles";
import lang from "@/lib/lang";
import {colors} from "@/constants/colors";
import SelectorInput from "@/components/ui/SelectorInput";
import {LinearGradient} from "expo-linear-gradient";
import RNDateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {useDatabase} from "@/stores/database";
import {z} from "zod/v4";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useNotifications} from "@/stores/notifications";
import {useStats} from "@/stores/stats";
import {units, getQuantityOptionsForUnit} from "@/lib/units";
import {getRandomPlaceholder} from "@/lib/utils";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {addDays} from "date-fns";

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

// Options pour le sélecteur de stockage
const storageOptions = [
    {label: lang.header.storageSelector.fridge, value: "fridge"},
    {label: lang.header.storageSelector.freezer, value: "freezer"},
    {label: lang.header.storageSelector.pantry, value: "pantry"},
];

/**
 * Schema Zod pour valider TOUT le formulaire avant soumission.
 * - name : string non vide (min 1 caractère)
 * - quantity : nombre positif (min 1)
 * - unit : string non vide
 * - storage : enum strict (3 valeurs possibles)
 * - expirationDate : Date dans le futur (refine custom)
 */
const itemSchema = z.object({
    name: z.string().min(1, {error: lang.errors.addItem.requiredName}),
    quantity: z.number().min(1),
    unit: z.string().min(1),
    storage: z.enum(["fridge", "freezer", "pantry"]),
    expirationDate: z.date().refine(date => date > new Date()),
});

/**
 * Schema Zod pour valider le query param ?storage=...
 * Permet de pré-sélectionner le type de stockage depuis la page d'accueil.
 */
const storageParamSchema = z.enum(["fridge", "freezer", "pantry"]);

const AddItem = () => {
    // Récupère le query param ?storage=... (optionnel)
    const { storage: storageParam } = useLocalSearchParams();

    // États locaux pour chaque champ du formulaire
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<{label: string, value: string}>({label: "1", value: "1"});
    const [unit, setUnit] = useState<{label: string, value: string}>({label: "pcs", value: "pcs"});

    /**
     * État storage avec pré-remplissage intelligent :
     * - Si storageParam existe ET est valide (fridge/freezer/pantry) : pré-sélectionne
     * - Sinon : défaut = fridge
     * Permet de garder le contexte quand l'utilisateur clique "+" depuis un storage spécifique
     */
    const [storage, setStorage] = useState<{label: string, value: string}>(
        storageParam && storageParamSchema.safeParse(storageParam).success
            ? {label: lang.header.storageSelector[storageParam as "fridge" | "freezer" | "pantry"], value: storageParam as string}
            : {label: lang.header.storageSelector.fridge, value: "fridge"}
    );

    // Date d'expiration par défaut = demain (addDays évite d'ajouter des produits déjà expirés)
    const [expirationDate, setExpirationDate] = useState<Date>(addDays(new Date(), 1));

    const { scheduleItemNotifications } = useNotifications();
    const { addTotalAddedItems } = useStats();
    const { addItem } = useDatabase();
    const router = useRouter();

    /**
     * Options de quantité dynamiques selon l'unité.
     * useMemo recalcule uniquement quand unit.value change.
     *
     * Exemples :
     * - pcs : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     * - kg : [0.1, 0.25, 0.5, 1, 2, 5]
     * - mL : [100, 250, 500, 750, 1000]
     */
    const quantityOptions = useMemo(() => {
        return getQuantityOptionsForUnit(unit.value);
    }, [unit.value]);

    /**
     * Handler du changement d'unité.
     * IMPORTANT : Reset la quantité à la première option disponible
     * pour éviter une quantité invalide (ex: "10 kg" n'existe pas dans les options)
     */
    const handleUnitChange = (newUnit: {label: string, value: string}) => {
        setUnit(newUnit);
        const newOptions = getQuantityOptionsForUnit(newUnit.value);
        setQuantity(newOptions[0]); // Auto-select première option
    };

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
        // Validation Zod avec safeParse (ne throw pas, retourne un objet result)
        const parsedItem = itemSchema.safeParse({
            name,
            quantity: Number(quantity.value),
            unit: unit.value,
            storage: storage.value as "fridge" | "freezer" | "pantry",
            expirationDate,
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

        // Insertion en DB (retourne l'ID du nouvel item)
        const newItemId = await addItem({
            name: parsedItem.data.name,
            quantity: parsedItem.data.quantity,
            unit: parsedItem.data.unit,
            storage: parsedItem.data.storage,
            expirationDate: parsedItem.data.expirationDate.toISOString(),
        });

        // Schedule les notifications (expired + soon expired)
        await scheduleItemNotifications({
            id: newItemId,
            name: parsedItem.data.name,
            quantity: parsedItem.data.quantity,
            unit: parsedItem.data.unit,
            storage: parsedItem.data.storage,
            expirationDate: parsedItem.data.expirationDate.toISOString(),
        });

        // Incrémente le compteur d'items ajoutés (pour le score anti-gaspi)
        addTotalAddedItems();

        // Reset complet du formulaire
        setName("");
        setQuantity({label: "1", value: "1"});
        setUnit({label: "pcs", value: "pcs"});
        setStorage({label: lang.header.storageSelector.fridge, value: "fridge"});
        setExpirationDate(new Date());

        // Retour à l'accueil (replace pour éviter de garder /add-item dans l'historique)
        router.replace("/");
    }

    return (
        <View>
            {/* Header avec bouton retour */}
            <Header variant="back" />

            <View style={styles.addItem}>
                {/* Titre et sous-titre de la page */}
                <Text style={styles.title}>{lang.addItem.title}</Text>
                <Text style={styles.subtitle}>{lang.addItem.subtitle}</Text>

                <View style={{marginTop: 30}}>
                    {/* CHAMP 1 : Nom du produit */}
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.name.label}</FormLabel>
                        <FormInput
                            placeholder={getRandomPlaceholder(storage.value as "fridge" | "freezer" | "pantry")}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* CHAMPS 2 & 3 : Quantité et Unité (côte à côte) */}
                    <View style={[styles.inputField, {flexDirection: "row", gap: 12}]}>
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.addItem.form.quantity.label}</FormLabel>
                            <SelectorInput
                                items={quantityOptions}
                                selectedItem={quantity}
                                onSelectItem={setQuantity}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.addItem.form.unit.label}</FormLabel>
                            {/* handleUnitChange reset la quantité quand l'unité change */}
                            <SelectorInput
                                items={units}
                                selectedItem={unit}
                                onSelectItem={handleUnitChange}
                            />
                        </View>
                    </View>

                    {/* CHAMP 4 : Date d'expiration (DateTimePicker natif iOS/Android) */}
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.expirationDate.label}</FormLabel>
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
                                        {expirationDate.toLocaleDateString("fr-FR", {
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
                        <FormLabel>{lang.addItem.form.storage.label}</FormLabel>
                        <SelectorInput
                            items={storageOptions}
                            selectedItem={storage}
                            onSelectItem={setStorage}
                        />
                    </View>

                    {/* BOUTON SUBMIT : Ajoute le produit */}
                    <AnimatedPressable onPress={handleAddItem}>
                        <LinearGradient style={styles.addBtn} colors={colors.blackGradient}>
                            <Text style={styles.addBtnText}>{lang.addItem.form.addButton}</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}
export default AddItem
