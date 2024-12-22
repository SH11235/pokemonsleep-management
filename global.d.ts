declare global {
    interface Window {
        gtag: (
            command: "config" | "event" | "set",
            targetId: string,
            params?: Record<string, unknown>,
        ) => void;
    }
}

export {};
