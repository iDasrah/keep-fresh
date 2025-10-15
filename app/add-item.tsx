import {View, Text, Pressable} from 'react-native'
import {useState, useMemo} from 'react'
import Header from "@/components/ui/Header";
import FormInput from "@/components/ui/FormInput";
import FormLabel from "@/components/ui/FormLabel";
import {styles} from "@/assets/style/add-item.styles";
import lang from "@/lib/lang";
import {colors} from "@/constants/colors";
import SelectorInput from "@/components/ui/SelectorInput";
import {LinearGradient} from "expo-linear-gradient";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {useDatabase} from "@/stores/database";
import {z} from "zod/v4";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useNotifications} from "@/stores/notifications";
import {useStats} from "@/stores/stats";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {units, getQuantityOptionsForUnit} from "@/lib/units";
import {getRandomPlaceholder} from "@/lib/utils";



const storageOptions = [
    {label: lang.header.storageSelector.fridge, value: "fridge"},
    {label: lang.header.storageSelector.freezer, value: "freezer"},
    {label: lang.header.storageSelector.pantry, value: "pantry"},
];

const itemSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    quantity: z.number().min(1, {message: "Quantity must be at least 1"}),
    unit: z.string().min(1, {message: "Unit is required"}),
    storage: z.enum(["fridge", "freezer", "pantry"]),
    expirationDate: z.date().refine(date => date > new Date(), {message: "Expiration date must be in the future"}),
});

const storageParamSchema = z.enum(["fridge", "freezer", "pantry"]);

const AddItem = () => {
    const { storage: storageParam } = useLocalSearchParams();
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<{label: string, value: string}>({label: "1", value: "1"});
    const [unit, setUnit] = useState<{label: string, value: string}>({label: "pcs", value: "pcs"});
    const [storage, setStorage] = useState<{label: string, value: string}>(storageParam && storageParamSchema.safeParse(storageParam).success ? {label: lang.header.storageSelector[storageParam as "fridge" | "freezer" | "pantry"], value: storageParam as string} : {label: lang.header.storageSelector.fridge, value: "fridge"});
    const [expirationDate, setExpirationDate] = useState<Date>(new Date());
    const { scheduleItemNotifications } = useNotifications();
    const { addTotalAddedItems } = useStats();

    const { addItem } = useDatabase();
    const router = useRouter();

    const quantityOptions = useMemo(() => {
        return getQuantityOptionsForUnit(unit.value);
    }, [unit.value]);

    const handleUnitChange = (newUnit: {label: string, value: string}) => {
        setUnit(newUnit);
        const newOptions = getQuantityOptionsForUnit(newUnit.value);
        setQuantity(newOptions[0]);
    };

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handleAddItem = async () => {
        try {
            const parsedItem = itemSchema.parse({
                name,
                quantity: Number(quantity.value),
                unit: unit.value,
                storage: storage.value as "fridge" | "freezer" | "pantry",
                expirationDate,
            });

            const id = await addItem({...parsedItem, expirationDate: parsedItem.expirationDate.toISOString()});

            await scheduleItemNotifications({id, ...parsedItem, expirationDate: parsedItem.expirationDate.toISOString()});
            addTotalAddedItems();

            setName("");
            setQuantity({label: "1", value: "1"});
            setUnit({label: "pcs", value: "pcs"});
            setStorage({label: lang.header.storageSelector.fridge, value: "fridge"});
            setExpirationDate(new Date());

            router.replace("/");
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.log("Validation errors:", error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    return (
        <View>
            <Header variant="back" />
            <View style={styles.addItem}>
                <Text style={styles.title}>{lang.addItem.title}</Text>
                <Text style={styles.subtitle}>{lang.addItem.subtitle}</Text>
                <View style={{marginTop: 30}}>
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.name.label}</FormLabel>
                        <FormInput
                            placeholder={getRandomPlaceholder(storage.value as "fridge" | "freezer" | "pantry")}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={[styles.inputField, {flexDirection: "row", gap: 12}]}>
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.addItem.form.quantity.label}</FormLabel>
                            <SelectorInput items={quantityOptions} selectedItem={quantity} onSelectItem={setQuantity} />
                        </View>
                        <View style={{flex: 1}}>
                            <FormLabel>{lang.addItem.form.unit.label}</FormLabel>
                            <SelectorInput items={units} selectedItem={unit} onSelectItem={handleUnitChange} />
                        </View>
                    </View>
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.expirationDate.label}</FormLabel>
                        <RNDateTimePicker value={expirationDate} onChange={(_, date) => setExpirationDate(date!)} />
                    </View>
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.storage.label}</FormLabel>
                        <SelectorInput items={storageOptions} selectedItem={storage} onSelectItem={setStorage} />
                    </View>
                    <Animated.View style={animatedStyle}>
                        <LinearGradient style={styles.addBtn} colors={colors.blackGradient}>
                            <Pressable onPress={handleAddItem} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                                <Text style={styles.addBtnText}>{lang.addItem.form.addButton}</Text>
                            </Pressable>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </View>
        </View>
    )
}
export default AddItem
