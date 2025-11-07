import { use, createContext, type PropsWithChildren } from 'react';
import {useStorageState} from "@/hooks/useStorageState";

const LocationContext = createContext<{
    setLocation: (locationId: string) => void;
    deleteLocation: () => void;
    location?: string | null;
    isLoading: boolean;
}>({
    setLocation: (_) => null,
    deleteLocation: () => null,
    location: null,
    isLoading: false,
});

export function useLocation() {
    const value = use(LocationContext);
    if (!value) {
        throw new Error('useLocation must be wrapped in a <LocationProvider />');
    }

    return value;
}

export function LocationProvider({ children }: PropsWithChildren) {
    const [[isLoading, location], setLocation] = useStorageState('locationId');

    return (
        <LocationContext.Provider
            value={{
                setLocation: (locationId: string) => {
                    setLocation(locationId);
                },
                deleteLocation: () => {
                    setLocation(null);
                },
                location,
                isLoading,
        }}>
            {children}
        </LocationContext.Provider>
    );
}
