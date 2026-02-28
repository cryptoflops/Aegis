"use client";

import { AppConfig, UserSession } from '@stacks/connect';

// We delay instantiation until it is explicitly requested by a use-client component's effect
// This prevents Next.js SSR from crashing when evaluating the module scope.
let sessionInstance: UserSession | null = null;

export function getUserSession(): UserSession {
    if (typeof window === 'undefined') {
        // Return a dummy object for any accidental server-side access to prevent crash
        return {} as UserSession;
    }

    if (!sessionInstance) {
        const appConfig = new AppConfig(['store_write', 'publish_data']);
        sessionInstance = new UserSession({ appConfig });
    }
    return sessionInstance;
}
