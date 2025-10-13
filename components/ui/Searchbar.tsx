import {View, TextInput} from "react-native";
import {styles} from "@/assets/style/searchbar.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";
import {useItems} from "@/stores/items";

const Searchbar = () => {
    const { searchText, setSearchText, selectedStorage } = useItems();

    return (
        <View style={styles.searchbar}>
            <Ionicons name="search" size={24} color={colors.textMuted} />
            <TextInput
                placeholder={lang.header.searchbar.placeholder[selectedStorage]}
                placeholderTextColor={colors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
    )
}
export default Searchbar
