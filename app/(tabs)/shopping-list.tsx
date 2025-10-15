import {View, Text, ScrollView, TextInput, Pressable} from "react-native";
import Header from "@/components/ui/Header";
import {styles} from "@/assets/style/shopping-list.styles";
import {SolarIcon} from "react-native-solar-icons";
import { colors } from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";
import AnimatedPressable from "@/components/ui/AnimatedPressable";

const ShoppingList = () => {
    return (
        <View>
            <Header />
            <View style={{padding: 16}}>
                <View style={styles.addItemContainer}>
                    <View style={styles.addItemInputContainer}>
                        <SolarIcon
                            name="CartPlus"
                            size={24}
                            color={colors.textMuted}
                            type="outline"
                        />
                        <TextInput
                            style={styles.addItemInput}
                            placeholder={lang.shoppingList.addItemFieldPlaceholder}
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>
                    <AnimatedPressable style={styles.addItemButton}>
                        <LinearGradient colors={colors.blackGradient} style={styles.addItemButtonContent}>
                            <Text style={styles.addItemButtonText}>+</Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom: 300}}>
                </ScrollView>
            </View>
        </View>
    )
}
export default ShoppingList
