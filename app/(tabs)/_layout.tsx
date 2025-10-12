import {Text} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {styles} from "@/assets/style/tab.styles";
import {TabList, Tabs, TabSlot, TabTrigger} from "expo-router/ui";
import {usePathname} from "expo-router";
import {colors} from "@/constants/colors";

const TabsLayout = () => {
    const pathName = usePathname();

    return <Tabs>
        <TabSlot style={{backgroundColor: colors.bgDark}} />
        <TabList style={styles.tabBar}>
            <TabTrigger name="index" href="/" style={[styles.tabBarItem, pathName === "/" ? styles.activeBarItem : {}, { gap: 4 }]}>
                <MaterialCommunityIcons name="fridge-outline" size={32} color={pathName === "/" ? colors.bg : colors.black} />
                {
                    pathName === "/" && <Text style={styles.tabBarItemText}>Fridges</Text>
                }
            </TabTrigger>
            <TabTrigger name="stats" href="/stats" style={[styles.tabBarItem, pathName === "/stats" ? styles.activeBarItem : {}]}>
                <Ionicons name="bar-chart-outline" size={32} color={pathName === "/stats" ? colors.bg : colors.black} />
                {
                    pathName === "/stats" && <Text style={styles.tabBarItemText}>Stats</Text>
                }
            </TabTrigger>
            <TabTrigger name="settings" href="/settings" style={[styles.tabBarItem, pathName === "/settings" ? styles.activeBarItem : {}]}>
                {
                    pathName === "/settings" && <Text style={styles.tabBarItemText}>Settings</Text>
                }
                <Ionicons name="settings-outline" size={32} color={pathName === "/settings" ? colors.bg : colors.black} />
            </TabTrigger>
        </TabList>
    </Tabs>
}
export default TabsLayout
