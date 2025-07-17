import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    candyBoostMultipliers,
    type CandyBoostEvent,
    type ExpType,
} from "@/constants";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
    getNextLevelExp,
} from "@/lib/calculate";
import type { CalculationRecord } from "@/types";

export const useCalculations = () => {
    const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
    const [selectedBoostEvent, setSelectedBoostEvent] = useState("none");
    const [customMultiplierForAll, setCustomMultiplierForAll] = useState(1);

    useEffect(() => {
        const savedRecords = JSON.parse(
            localStorage.getItem("calculations") || "[]",
        );
        setCalculations(savedRecords);
    }, []);

    const updateCalculations = (updated: CalculationRecord[]) => {
        setCalculations(updated);
        localStorage.setItem("calculations", JSON.stringify(updated));
    };

    const handleInputChange = (
        id: string,
        field: keyof CalculationRecord,
        value: string | number,
    ) => {
        const updatedCalculations = calculations.map((calc) => {
            if (calc.id !== id) return calc;

            const boostEvent =
                field === "boostEvent"
                    ? (value as CandyBoostEvent)
                    : calc.boostEvent;
            const customMultiplier =
                field === "customMultiplier"
                    ? (value as number)
                    : field === "boostEvent"
                      ? candyBoostMultipliers[boostEvent].multiplier
                      : calc.customMultiplier;
            const currentLevel =
                field === "currentLevel"
                    ? (value as number)
                    : calc.currentLevel;
            const expType =
                field === "expType" ? (value as ExpType) : calc.expType;
            const expToNextLevel =
                field === "currentLevel" || field === "expType"
                    ? getNextLevelExp(currentLevel, expType)
                    : field === "expToNextLevel"
                      ? (value as number)
                      : calc.expToNextLevel;

            const ownedCandy =
                field === "ownedCandy" ? (value as number) : calc.ownedCandy;

            const updatedCalc = {
                ...calc,
                [field]: value,
                customMultiplier,
                expToNextLevel,
            };

            // 再計算
            const multiplier =
                boostEvent === "custom"
                    ? customMultiplier
                    : candyBoostMultipliers[boostEvent].multiplier;

            updatedCalc.requiredExp = calcTotalRequiredExp(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
            );

            updatedCalc.requiredCandy = calcRequiredCandy(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                boostEvent,
            );

            updatedCalc.requiredDreamShards = calcRequiredDreamShards(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                multiplier,
                boostEvent,
            );

            // 不足アメの計算
            updatedCalc.lackingCandy = Math.max(
                0,
                updatedCalc.requiredCandy - ownedCandy,
            );

            return updatedCalc;
        });

        updateCalculations(updatedCalculations);
    };

    const handleAddNew = () => {
        const defaultValue: CalculationRecord = {
            id: uuidv4(),
            pokemonName: "",
            currentLevel: 15,
            targetLevel: 30,
            expToNextLevel: 440,
            expType: "600",
            nature: "normal",
            boostEvent: "none",
            customMultiplier: 1,
            requiredCandy: calcRequiredCandy(
                15,
                30,
                "normal",
                "600",
                440,
                "none",
            ),
            requiredDreamShards: calcRequiredDreamShards(
                15,
                30,
                "normal",
                "600",
                440,
                1,
                "none",
            ),
            requiredExp: calcTotalRequiredExp(15, 30, "600", 440),
            includeInTotal: true,
            ownedCandy: 0,
            lackingCandy: calcRequiredCandy(
                15,
                30,
                "normal",
                "600",
                440,
                "none",
            ),
        };

        const updatedCalculations = [...calculations, defaultValue];
        updateCalculations(updatedCalculations);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("本当に削除しますか？")) {
            const updatedCalculations = calculations.filter(
                (calc) => calc.id !== id,
            );
            updateCalculations(updatedCalculations);
        }
    };

    const handleBoostEventChange = (
        newBoostEvent: keyof typeof candyBoostMultipliers,
    ) => {
        setSelectedBoostEvent(newBoostEvent);

        const updatedCalculations = calculations.map((calc) => {
            const updatedCalc = {
                ...calc,
                boostEvent: newBoostEvent,
                customMultiplier:
                    candyBoostMultipliers[newBoostEvent].multiplier,
            };

            const multiplier =
                newBoostEvent === "custom"
                    ? updatedCalc.customMultiplier
                    : candyBoostMultipliers[newBoostEvent].multiplier;

            updatedCalc.requiredExp = calcTotalRequiredExp(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
            );

            updatedCalc.requiredCandy = calcRequiredCandy(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                newBoostEvent,
            );

            updatedCalc.requiredDreamShards = calcRequiredDreamShards(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                multiplier,
                newBoostEvent,
            );

            // 不足アメの再計算
            updatedCalc.lackingCandy = Math.max(
                0,
                updatedCalc.requiredCandy - updatedCalc.ownedCandy,
            );

            return updatedCalc;
        });

        updateCalculations(updatedCalculations);
    };

    const handleCustomMultiplierApply = () => {
        const updatedCalculations = calculations.map((calc) => {
            if (calc.boostEvent !== "custom") return calc;

            const updatedCalc = {
                ...calc,
                customMultiplier: customMultiplierForAll,
            };

            updatedCalc.requiredCandy = calcRequiredCandy(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                "custom",
            );

            updatedCalc.requiredDreamShards = calcRequiredDreamShards(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                customMultiplierForAll,
                "custom",
            );

            // 不足アメの再計算
            updatedCalc.lackingCandy = Math.max(
                0,
                updatedCalc.requiredCandy - updatedCalc.ownedCandy,
            );

            return updatedCalc;
        });

        updateCalculations(updatedCalculations);
    };

    return {
        calculations,
        updateCalculations,
        selectedBoostEvent,
        customMultiplierForAll,
        handleInputChange,
        handleAddNew,
        handleDelete,
        handleBoostEventChange,
        handleCustomMultiplierApply,
        setCustomMultiplierForAll,
    };
};
