import {ScrollView, View} from "react-native";
import Header from "@/components/ui/Header";
import ItemsList from "@/components/ui/ItemsList";
import {useItems} from "@/stores/items";

/**
 * SCREEN : Page principale - Liste des produits du frigo
 *
 * Affiche tous les items avec filtres par :
 * - Stockage (frigo/congélateur/placards/tous)
 * - Recherche textuelle
 *
 * Le Header contient :
 * - Searchbar pour filtrer par nom
 * - StorageSelector pour filtrer par type de stockage
 * - Bouton + pour ajouter un produit
 *
 * La liste est triée par date d'expiration (plus proche en premier)
 */
export default function Index() {
    // Récupère les filtres depuis le store global
    const {selectedStorage, searchText} = useItems();

    return (
        <View>
            {/* Header avec search et storage selector */}
            <Header variant="index" />

            {/*
                ScrollView avec padding bottom important pour éviter
                que le contenu soit caché par la bottom tab bar
            */}
            <ScrollView
                style={{padding: 16}}
                contentContainerStyle={{paddingBottom: 300}}
            >
                {/*
                    ItemsList gère le fetch, le tri et l'affichage des items
                    Si selectedStorage === "all", on ne passe pas de storage (undefined)
                    pour récupérer tous les items
                */}
                <ItemsList
                    storage={selectedStorage !== "all" ? selectedStorage : undefined}
                    searchText={searchText}
                />
            </ScrollView>
        </View>
  );
}
