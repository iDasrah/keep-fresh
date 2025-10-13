import {Text} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {styles} from "@/assets/style/tab.styles";
import {TabList, Tabs, TabSlot, TabTrigger} from "expo-router/ui";
import {usePathname} from "expo-router";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";

const TabsLayout = () => {
    const pathName = usePathname();

    return <Tabs>
        <TabSlot style={{backgroundColor: colors.bgDark}}/>
        <TabList style={styles.tabBar}>
            <TabTrigger name="index" href="/">
                {
                    pathName === "/" ? (
                        <LinearGradient colors={colors.blackGradient} style={[styles.activeBarItem, styles.tabBarItem, {gap: 4}]}>
                            <MaterialCommunityIcons name="fridge-outline" size={32} color={colors.bg} />
                            <Text style={styles.tabBarItemText}>{lang.tab.index}</Text>
                        </LinearGradient>
                    ) : <MaterialCommunityIcons name="fridge-outline" size={32} color={colors.black} style={styles.tabBarItem} />
                }
            </TabTrigger>
            <TabTrigger name="stats" href="/stats">
                {
                    pathName === "/stats" ? (
                        <LinearGradient colors={colors.blackGradient} style={[styles.activeBarItem, styles.tabBarItem]}>
                            <Ionicons name="bar-chart-outline" size={32} color={colors.bg}/>
                            <Text style={styles.tabBarItemText}>{lang.tab.stats}</Text>
                        </LinearGradient>
                    ) : <Ionicons name="bar-chart-outline" size={32} color={colors.black} style={styles.tabBarItem} />
                }
            </TabTrigger>
            <TabTrigger name="settings" href="/settings">
                {
                    pathName === "/settings" ? (
                        <LinearGradient colors={colors.blackGradient} style={[styles.activeBarItem, styles.tabBarItem]}>
                            <Text style={styles.tabBarItemText}>{lang.tab.settings}</Text>
                            <Ionicons name="settings-outline" size={32} color={colors.bg}/>
                        </LinearGradient>
                    ) : <Ionicons name="settings-outline" size={32} color={colors.black} style={styles.tabBarItem} />
                }
            </TabTrigger>
        </TabList>
    </Tabs>
}
export default TabsLayout
