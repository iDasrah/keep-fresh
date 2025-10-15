import {LayoutChangeEvent, View} from "react-native";
import {styles} from "@/assets/style/tab.styles";
import {TabList, Tabs, TabSlot, TabTrigger} from "expo-router/ui";
import {usePathname} from "expo-router";
import {colors} from "@/constants/colors";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {useEffect, useRef} from "react";
import {SolarIcon} from "react-native-solar-icons";

/**
 * LAYOUT : Bottom Tab Navigation avec indicateur animé
 *
 * Ce composant gère la navigation entre les 4 onglets principaux :
 * 1. Index (/) - Liste des produits du frigo
 * 2. Shopping List (/shopping-list) - Liste de courses
 * 3. Stats (/stats) - Statistiques anti-gaspi
 * 4. Settings (/settings) - Paramètres
 *
 * ANIMATION :
 * Un background noir avec gradient (LinearGradient) se déplace horizontalement
 * et change de taille pour suivre l'onglet actif.
 *
 * TECHNIQUE :
 * - useRef : Stocke les positions (x) et largeurs de chaque tab
 * - onLayout : Enregistre les dimensions de chaque tab au premier render
 * - useSharedValue : Valeurs animées (bgX, width) pour Reanimated
 * - withSpring : Animation élastique fluide lors du changement de tab
 * - useAnimatedStyle : Génère les styles animés (transform, width)
 */
const TabsLayout = () => {
    // Pathname actuel (ex: "/", "/stats", etc.)
    const pathName = usePathname();

    // Valeurs animées Reanimated (position X et largeur de l'indicateur)
    const bgX = useSharedValue(0);
    const width = useSharedValue(120);

    /**
     * Ref pour stocker les dimensions de chaque tab.
     * Structure : { "/": {x: 0, width: 100}, "/stats": {x: 100, width: 120}, ... }
     * Permet de retrouver rapidement la position de chaque tab lors du changement de route.
     */
    const tabLayouts = useRef<Record<string, {x: number; width: number}>>({});

    /**
     * Handler onLayout : Enregistre les dimensions d'un tab.
     * Appelé au premier render de chaque TabTrigger.
     *
     * Si le tab est déjà actif (pathName === tabName), on positionne
     * immédiatement l'indicateur dessus.
     */
    const handleLayout = (tabName: string, event: LayoutChangeEvent) => {
        const {x, width: tabWidth} = event.nativeEvent.layout;
        tabLayouts.current[tabName] = {x, width: tabWidth};

        if (pathName === tabName) {
            bgX.value = withSpring(x);
            width.value = withSpring(tabWidth);
        }
    };

    /**
     * useEffect : Déclenche l'animation quand l'utilisateur change d'onglet.
     * Récupère les dimensions du nouveau tab depuis tabLayouts.current
     * et anime bgX et width avec un effet spring.
     */
    useEffect(() => {
        const layout = tabLayouts.current[pathName];
        if (layout) {
            bgX.value = withSpring(layout.x);
            width.value = withSpring(layout.width);
        }
    }, [bgX, pathName, width]);

    /**
     * Style animé pour l'indicateur de sélection.
     * - translateX : Position horizontale (suit le tab actif)
     * - width : Largeur dynamique (s'adapte à chaque tab)
     */
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: bgX.value}],
        width: width.value,
    }));

    return <Tabs>
        {/* TabSlot : Zone où s'affichent les screens de chaque tab */}
        <TabSlot style={{backgroundColor: colors.bgDark}}/>

        {/* TabList : Barre de navigation en bas */}
        <TabList style={styles.tabBar}>
            {/*
                Indicateur animé de sélection.
                Position et largeur s'animent avec withSpring quand on change d'onglet.
            */}
            <Animated.View style={[styles.activeBackground, animatedStyle]}>
                <LinearGradient colors={colors.blackGradient} style={styles.activeBarItem} />
            </Animated.View>

            {/* TAB 1 : Index (frigo) */}
            <TabTrigger
                name="index"
                href="/"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/', e)} // Enregistre dimensions
            >
                <View style={styles.tabBarItem}>
                    <SolarIcon
                        name="Fridge"
                        size={32}
                        color={pathName === '/' ? colors.bg : colors.black} // Blanc si actif
                        type="outline"
                    />
                </View>
            </TabTrigger>

            {/* TAB 2 : Shopping List */}
            <TabTrigger
                name="shopping-list"
                href="/shopping-list"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/shopping-list', e)}
            >
                <SolarIcon
                    name="CartLarge"
                    size={32}
                    color={pathName === '/shopping-list' ? colors.bg : colors.black}
                    type="outline"
                />
            </TabTrigger>

            {/* TAB 3 : Stats */}
            <TabTrigger
                name="stats"
                href="/stats"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/stats', e)}
            >
                <View style={styles.tabBarItem}>
                    <SolarIcon
                        name="ChartSquare"
                        size={32}
                        color={pathName === '/stats' ? colors.bg : colors.black}
                        type="outline"
                    />
                </View>
            </TabTrigger>

            {/* TAB 4 : Settings */}
            <TabTrigger
                name="settings"
                href="/settings"
                style={styles.tabTrigger}
                onLayout={(e) => handleLayout('/settings', e)}
            >
                <View style={styles.tabBarItem}>
                    <SolarIcon
                        name="Settings"
                        size={32}
                        color={pathName === '/settings' ? colors.bg : colors.black}
                        type="outline"
                    />
                </View>
            </TabTrigger>
        </TabList>
    </Tabs>
}
export default TabsLayout