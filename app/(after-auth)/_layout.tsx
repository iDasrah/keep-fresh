import {SplashScreen, Stack} from 'expo-router';
import {useEffect, useState} from "react";
import {Alert} from "react-native";
import lang from "@/lib/lang";
import {AxiosError} from "axios";
import {useApiMutation} from "@/lib/useApiMutation";
import {api} from "@/lib/api";
import {useLocation} from "@/providers/location";

SplashScreen.preventAutoHideAsync();

export default function Root() {
    const { location, setLocation, deleteLocation, isLoading } = useLocation();
    const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);

    const getLocationsV1 = useApiMutation(() => api.location.getLocationsV1());
    const getLocationV1 = useApiMutation((data: string) => api.location.getLocationV1(data));

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (!location) {
                    const locations = await getLocationsV1.mutateAsync({});
                    if (locations.data.length > 0) {
                        setLocation(locations.data[0].id);
                        setIsLocationLoading(false);
                        return;
                    }
                } else {
                    await getLocationV1.mutateAsync(location);
                    setIsLocationLoading(false);
                    return;
                }
            } catch (error: unknown) {
                deleteLocation();
                setIsLocationLoading(false);

                if (error instanceof AxiosError && error.response?.data?.message) {
                    Alert.alert('Error', error.response.data.message);
                    return;
                }
                Alert.alert('Error', lang.errors.generic);
            }
        };

        void fetchLocation();
    }, []);

    if (!isLoading && !isLocationLoading) {
        SplashScreen.hide();
    }

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Protected guard={!!location}>
                <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Protected guard={!location}>
                <Stack.Screen name="add-first-location" />
            </Stack.Protected>
        </Stack>
    );
}
