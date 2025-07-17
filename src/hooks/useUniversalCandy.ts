import { useState, useEffect, useCallback } from "react";

import type { universalCandySizes } from "@/constants";
import { universalCandyValues } from "@/constants";

type UniversalCandy = {
    [key in (typeof universalCandySizes)[number]]: {
        count: number;
    };
};

const defaultUniversalCandy = {
    S: { count: 0 },
    M: { count: 0 },
    L: { count: 0 },
};

export const useUniversalCandy = () => {
    const [universalCandy, setUniversalCandy] = useState<UniversalCandy>(() => {
        const saved = localStorage.getItem("universalCandy");
        return saved ? JSON.parse(saved) : defaultUniversalCandy;
    });

    const [ownedCandy, setOwnedCandy] = useState(() => {
        const saved = localStorage.getItem("ownedCandy");
        return saved ? Number(saved) : 0;
    });

    const calculatedOwnedCandy =
        universalCandy.S.count * universalCandyValues.S +
        universalCandy.M.count * universalCandyValues.M +
        universalCandy.L.count * universalCandyValues.L +
        ownedCandy;

    const handleCandyChange = useCallback(
        (type: keyof UniversalCandy, value: number) => {
            setUniversalCandy((prev) => ({
                ...prev,
                [type]: { count: value },
            }));
        },
        [],
    );

    const handleOwnedCandyChange = useCallback((value: number) => {
        setOwnedCandy(value);
    }, []);

    useEffect(() => {
        localStorage.setItem("universalCandy", JSON.stringify(universalCandy));
        localStorage.setItem("ownedCandy", ownedCandy.toString());
    }, [universalCandy, ownedCandy]);

    return {
        universalCandy,
        ownedCandy,
        handleCandyChange,
        handleOwnedCandyChange,
        calculatedOwnedCandy,
    };
};
