import {View, TextInput} from "react-native";
import {styles} from "@/assets/style/searchbar.styles";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import {useItems} from "@/stores/items";
import {useTranslation} from "react-i18next";

/**
 * COMPONENT : Searchbar (barre de recherche)
 *
 * Input de recherche avec icône loupe pour filtrer les items par nom.
 *
 * FONCTIONNEMENT :
 * - searchText : État global Zustand (store items)
 * - setSearchText : Met à jour l'état global
 * - Placeholder dynamique selon le storage sélectionné :
 *   * "Chercher dans le frigo..."
 *   * "Chercher dans le congélateur..."
 *   * "Chercher dans les placards..."
 *   * "Chercher un produit..." (si "all")
 *
 * EFFET :
 * Quand l'utilisateur tape, ItemsList détecte le changement via React Query
 * (queryKey inclut searchText) et refetch automatiquement les items filtrés.
 */
const Searchbar = () => {
    const { t, ready } = useTranslation();
    const { searchText, setSearchText, selectedStorage } = useItems();

    if (!ready) {
        return;
    }

    return (
        <View style={styles.searchbar}>
            {/* Icône de recherche (loupe) */}
            <Ionicons name="search" size={24} color={colors.textMuted} />

            {/* Input avec placeholder dynamique selon le storage */}
            <TextInput
                placeholder={t(`header.searchbar.placeholder.${selectedStorage ?? "ALL"}`)}
                placeholderTextColor={colors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
    )
}
export default Searchbar
