import { View } from "react-native";
import Header from "@/components/ui/Header";
import ItemsList from "@/components/ui/ItemsList";
import {useItems} from "@/stores/items";

export default function Index() {
    const {selectedStorage, searchText} = useItems();

    return (
        <View>
            <Header variant="index" />
            <View style={{padding: 16}}>
                <ItemsList storage={selectedStorage !== "all" ? selectedStorage : undefined} searchText={searchText} />
            </View>
        </View>
  );
}
