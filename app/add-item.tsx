import {View, Text} from 'react-native'
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
import {units, getQuantityOptionsForUnit} from "@/lib/units";
import {getRandomPlaceholder} from "@/lib/utils";
import AnimatedPressable from "@/components/ui/AnimatedPressable";
import {addDays} from "date-fns";



const storageOptions = [
    {label: lang.header.storageSelector.fridge, value: "fridge"},
    {label: lang.header.storageSelector.freezer, value: "freezer"},
    {label: lang.header.storageSelector.pantry, value: "pantry"},
];

const itemSchema = z.object({
    name: z.string().min(1, {error: lang.errors.addItem.requiredName}),
    quantity: z.number().min(1),
    unit: z.string().min(1),
    storage: z.enum(["fridge", "freezer", "pantry"]),
    expirationDate: z.date().refine(date => date > new Date()),
});

const storageParamSchema = z.enum(["fridge", "freezer", "pantry"]);

const AddItem = () => {
    const { storage: storageParam } = useLocalSearchParams();
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<{label: string, value: string}>({label: "1", value: "1"});
    const [unit, setUnit] = useState<{label: string, value: string}>({label: "pcs", value: "pcs"});
    const [storage, setStorage] = useState<{label: string, value: string}>(storageParam && storageParamSchema.safeParse(storageParam).success ? {label: lang.header.storageSelector[storageParam as "fridge" | "freezer" | "pantry"], value: storageParam as string} : {label: lang.header.storageSelector.fridge, value: "fridge"});
    const [expirationDate, setExpirationDate] = useState<Date>(addDays(new Date(), 1));
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

    const handleAddItem = async () => {

        const parsedItem = itemSchema.safeParse({
            name,
            quantity: Number(quantity.value),
            unit: unit.value,
            storage: storage.value as "fridge" | "freezer" | "pantry",
            expirationDate,
        });

        if (!parsedItem.success) {
            const firstError = Object.values(parsedItem.error.flatten().fieldErrors)[0];
            if (firstError && firstError[0]) {
                alert(firstError[0]);
            } else {
                alert(lang.errors.generic);
            }
            return;
        }

        const newItemId = await addItem({
            name: parsedItem.data.name,
            quantity: parsedItem.data.quantity,
            unit: parsedItem.data.unit,
            storage: parsedItem.data.storage,
            expirationDate: parsedItem.data.expirationDate.toISOString(),
        });

        await scheduleItemNotifications({
            id: newItemId,
            name: parsedItem.data.name,
            quantity: parsedItem.data.quantity,
            unit: parsedItem.data.unit,
            storage: parsedItem.data.storage,
            expirationDate: parsedItem.data.expirationDate.toISOString(),
        });
        addTotalAddedItems();

        setName("");
        setQuantity({label: "1", value: "1"});
        setUnit({label: "pcs", value: "pcs"});
        setStorage({label: lang.header.storageSelector.fridge, value: "fridge"});
        setExpirationDate(new Date());

        router.replace("/");
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
                        <RNDateTimePicker
                            value={expirationDate}
                            onChange={(_, date) => setExpirationDate(date!)}
                            minimumDate={addDays(new Date(), 1)}
                        />
                    </View>
                    <View style={styles.inputField}>
                        <FormLabel>{lang.addItem.form.storage.label}</FormLabel>
                        <SelectorInput items={storageOptions} selectedItem={storage} onSelectItem={setStorage} />
                    </View>
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
