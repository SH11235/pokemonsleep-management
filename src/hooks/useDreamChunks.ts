import { useState, useEffect, useCallback } from "react";

import type { dreamChunkSizes } from "@/constants";

type DreamChunks = {
    [key in (typeof dreamChunkSizes)[number]]: {
        count: number;
        amount: number;
    };
};

const defaultDreamChunks = {
    S: { count: 0, amount: 2498 },
    M: { count: 0, amount: 14988 },
    L: { count: 0, amount: 62450 },
};

export const useDreamChunks = () => {
    const [dreamChunks, setDreamChunks] = useState<DreamChunks>(() => {
        const saved = localStorage.getItem("dreamChunks");
        return saved ? JSON.parse(saved) : defaultDreamChunks;
    });

    const [ownedChunks, setOwnedChunks] = useState(() => {
        const saved = localStorage.getItem("ownedChunks");
        return saved ? Number(saved) : 0;
    });

    const calculateOwnedDreamShards = useCallback(() => {
        return (
            dreamChunks.S.count * dreamChunks.S.amount +
            dreamChunks.M.count * dreamChunks.M.amount +
            dreamChunks.L.count * dreamChunks.L.amount +
            ownedChunks
        );
    }, [dreamChunks, ownedChunks]);

    const handleChunkChange = useCallback(
        (type: keyof DreamChunks, field: "count" | "amount", value: number) => {
            setDreamChunks((prev) => ({
                ...prev,
                [type]: { ...prev[type], [field]: value },
            }));
        },
        [],
    );

    const handleOwnedChunksChange = useCallback((value: number) => {
        setOwnedChunks(value);
    }, []);

    useEffect(() => {
        localStorage.setItem("dreamChunks", JSON.stringify(dreamChunks));
        localStorage.setItem("ownedChunks", ownedChunks.toString());
    }, [dreamChunks, ownedChunks]);

    return {
        dreamChunks,
        ownedChunks,
        handleChunkChange,
        handleOwnedChunksChange,
        calculateOwnedDreamShards,
    };
};
