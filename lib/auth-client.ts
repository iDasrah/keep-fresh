import { createAuthClient } from "better-auth/react"
import {expoClient} from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    basePath: 'auth',
    trustedOrigins: ["keepfresh://"],
    plugins: [
        expoClient({
            scheme: "keepfresh",
            storagePrefix: "keepfresh",
            storage: SecureStore,
        })
    ]
})
