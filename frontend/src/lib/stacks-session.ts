"use client";

// Lazy-initialized to avoid SSR crashes — @stacks/connect uses browser APIs at module scope
let _userSession: any = null;

function init() {
    if (_userSession) return _userSession;
    // Dynamic require at runtime only (client-side)
    const { AppConfig, UserSession } = require('@stacks/connect');
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    _userSession = new UserSession({ appConfig });
    return _userSession;
}

export const userSession = typeof window !== 'undefined'
    ? init()
    : new Proxy({} as any, {
        get: () => () => { throw new Error('userSession used during SSR'); },
    });
