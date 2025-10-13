import {ScrollView, View} from "react-native";
import Header from "@/components/ui/Header";
import ItemsList from "@/components/ui/ItemsList";
import {useItems} from "@/stores/items";

export default function Index() {
    const {selectedStorage, searchText} = useItems();

    return (
        <View>
            <Header variant="index" />
            <ScrollView style={{padding: 16}} contentContainerStyle={{paddingBottom: 300}}>
                <ItemsList storage={selectedStorage !== "all" ? selectedStorage : undefined} searchText={searchText} />
            </ScrollView>
        </View>
  );
}
