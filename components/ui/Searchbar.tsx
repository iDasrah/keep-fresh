import {View, TextInput} from "react-native";
import {styles} from "@/assets/style/searchbar.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";

const Searchbar = () => {
    return (
        <View style={styles.searchbar}>
            <Ionicons name="search" size={24} color={colors.textMuted} />
            <TextInput placeholder={lang.header.searchbar.placeholder.all} placeholderTextColor={colors.textMuted} />
        </View>
    )
}
export default Searchbar
