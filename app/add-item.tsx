import {View, Text, TextInput, Pressable} from 'react-native'
import {useState} from 'react'
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/add-item.styles";
import lang from "@/lib/lang";
import {colors} from "@/constants/colors";
import SelectorInput from "@/components/ui/SelectorInput";
import {LinearGradient} from "expo-linear-gradient";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {useDatabase} from "@/stores/database";
import {z} from "zod/v4";
import { useRouter } from "expo-router";
import {scheduleItemNotifications} from "@/lib/notifications";

const quantityOptions = Array.from({length: 100}, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString()
}));

const unitOptions = [
    {label: "pcs", value: "pcs"},
    {label: "kg", value: "kg"},
    {label: "g", value: "g"},
    {label: "L", value: "L"},
    {label: "ml", value: "ml"},
    {label: "box", value: "box"},
    {label: "bottle", value: "bottle"},
    {label: "bag", value: "bag"},
];

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

const AddItem = () => {
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<{label: string, value: string}>({label: "1", value: "1"});
    const [unit, setUnit] = useState<{label: string, value: string}>({label: "pcs", value: "pcs"});
    const [storage, setStorage] = useState<{label: string, value: string}>({label: lang.header.storageSelector.fridge, value: "fridge"});
    const [expirationDate, setExpirationDate] = useState<Date>(new Date());

    const { addItem } = useDatabase();
    const router = useRouter();

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

            setName("");
            setQuantity({label: "1", value: "1"});
            setUnit({label: "pcs", value: "pcs"});
            setStorage({label: lang.header.storageSelector.fridge, value: "fridge"});
            setExpirationDate(new Date());

            const notifIds = await scheduleItemNotifications(name, expirationDate, id.toString());

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
                        <Text style={styles.label}>{lang.addItem.form.name.label}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={lang.addItem.form.name.placeholder}
                            placeholderTextColor={colors.textMuted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={[styles.inputField, {flexDirection: "row", gap: 12}]}>
                        <View style={{flex: 1}}>
                            <Text style={styles.label}>{lang.addItem.form.quantity.label}</Text>
                            <SelectorInput items={quantityOptions} selectedItem={quantity} onSelectItem={setQuantity} />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.label}>{lang.addItem.form.unit.label}</Text>
                            <SelectorInput items={unitOptions} selectedItem={unit} onSelectItem={setUnit} />
                        </View>
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.label}>{lang.addItem.form.expirationDate.label}</Text>
                        <RNDateTimePicker value={expirationDate} onChange={(_, date) => setExpirationDate(date!)} />
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.label}>{lang.addItem.form.storage.label}</Text>
                        <SelectorInput items={storageOptions} selectedItem={storage} onSelectItem={setStorage} />
                    </View>
                    <LinearGradient style={styles.addBtn} colors={["#404040", colors.black]}>
                        <Pressable onPress={handleAddItem}>
                            <Text style={styles.addBtnText}>{lang.addItem.form.addButton}</Text>
                        </Pressable>
                    </LinearGradient>
                </View>
            </View>
        </View>
    )
}
export default AddItem
