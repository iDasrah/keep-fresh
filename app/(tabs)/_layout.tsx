import {Text, LayoutChangeEvent} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {styles} from "@/assets/style/tab.styles";
import {TabList, Tabs, TabSlot, TabTrigger} from "expo-router/ui";
import {usePathname} from "expo-router";
import {colors} from "@/constants/colors";
import lang from "@/lib/lang";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {useEffect, useRef} from "react";

const TabsLayout = () => {
    const pathName = usePathname();
    const bgX = useSharedValue(0);
    const width = useSharedValue(120);
    const tabLayouts = useRef<Record<string, {x: number; width: number}>>({});

    const handleLayout = (tabName: string, event: LayoutChangeEvent) => {
        const {x, width: tabWidth} = event.nativeEvent.layout;
        tabLayouts.current[tabName] = {x, width: tabWidth};

        if (pathName === tabName) {
            bgX.value = withSpring(x);
            width.value = withSpring(tabWidth);
        }
    };

    useEffect(() => {
        const layout = tabLayouts.current[pathName];
        if (layout) {
            bgX.value = withSpring(layout.x);
            width.value = withSpring(layout.width);
        }
    }, [bgX, pathName, width]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: bgX.value}],
        width: width.value,
    }));

    return <Tabs>
        <TabSlot style={{backgroundColor: colors.bgDark}}/>
        <TabList style={styles.tabBar}>
            <Animated.View style={[styles.activeBackground, animatedStyle]}>
                <LinearGradient colors={colors.blackGradient} style={styles.activeBarItem} />
            </Animated.View>

            <TabTrigger
                name="index"
                href="/"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/', e)}
            >
                <MaterialCommunityIcons
                    name="fridge-outline"
                    size={32}
                    color={pathName === '/' ? colors.bg : colors.black}
                    style={[styles.tabBarItem, {paddingHorizontal: 2}]}
                />
                {pathName === "/" && <Text style={styles.tabBarItemText}>{lang.tab.index}</Text>}
            </TabTrigger>

            <TabTrigger
                name="stats"
                href="/stats"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/stats', e)}
            >
                <Ionicons
                    name="bar-chart-outline"
                    size={32}
                    color={pathName === '/stats' ? colors.bg : colors.black}
                    style={styles.tabBarItem}
                />
                {pathName === "/stats" && <Text style={styles.tabBarItemText}>{lang.tab.stats}</Text>}
            </TabTrigger>

            <TabTrigger
                name="settings"
                href="/settings"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/settings', e)}
            >
                {pathName === "/settings" && <Text style={styles.tabBarItemText}>{lang.tab.settings}</Text>}
                <Ionicons
                    name="settings-outline"
                    size={32}
                    color={pathName === '/settings' ? colors.bg : colors.black}
                    style={styles.tabBarItem}
                />
            </TabTrigger>
        </TabList>
    </Tabs>
}
export default TabsLayout