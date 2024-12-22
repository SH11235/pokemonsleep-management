import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    expTypeToRatio,
    natureToCandyExp,
    candyBoostMultipliers,
    type CandyBoostEvent,
} from "@/constants";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
} from "@/lib/calculate";
import type { CalculationRecord } from "@/types";

const CalculationList = () => {
    const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
    const [selectedBoostEvent, setSelectedBoostEvent] = useState("none");

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
        requiredCandy: calcRequiredCandy(15, 30, "normal", "600", 440, "none"),
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
    };

    useEffect(() => {
        const savedRecords = JSON.parse(
            localStorage.getItem("calculations") || "[]",
        );
        setCalculations(savedRecords);
    }, []);

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
            const updatedCalc = {
                ...calc,
                [field]: value,
                customMultiplier,
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

            return updatedCalc;
        });
        setCalculations(updatedCalculations);
        localStorage.setItem(
            "calculations",
            JSON.stringify(updatedCalculations),
        );
    };

    const handleCheckboxChange = (id: string) => {
        const updatedCalculations = calculations.map((calc) =>
            calc.id === id
                ? { ...calc, includeInTotal: !calc.includeInTotal }
                : calc,
        );
        setCalculations(updatedCalculations);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("本当に削除しますか？")) {
            const updatedCalculations = calculations.filter(
                (calc) => calc.id !== id,
            );
            setCalculations(updatedCalculations);
            localStorage.setItem(
                "calculations",
                JSON.stringify(updatedCalculations),
            );
        }
    };

    const handleAddNew = () => {
        const newRecord = { ...defaultValue };
        const updatedCalculations = [...calculations, newRecord];
        setCalculations(updatedCalculations);
        localStorage.setItem(
            "calculations",
            JSON.stringify(updatedCalculations),
        );
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

            return updatedCalc;
        });

        setCalculations(updatedCalculations);
        localStorage.setItem(
            "calculations",
            JSON.stringify(updatedCalculations),
        );
    };

    const totalDreamShards = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredDreamShards, 0);

    return (
        <div className="mt-6 p-6 mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                計算結果テーブル
            </h2>
            <div className="mb-4 text-lg font-semibold text-gray-700">
                選択されたポケモンに必要なゆめのかけら合計値:{" "}
                <span className="text-green-600">{totalDreamShards}</span>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                    アメブーストイベント一括変更
                </h3>
                <div className="flex gap-4">
                    {Object.entries(candyBoostMultipliers).map(
                        ([key, { label }]) => (
                            <label
                                key={key}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    name="boostEvent"
                                    value={key}
                                    checked={selectedBoostEvent === key}
                                    onChange={(e) =>
                                        handleBoostEventChange(
                                            e.target
                                                .value as keyof typeof candyBoostMultipliers,
                                        )
                                    }
                                />
                                {label}
                            </label>
                        ),
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={handleAddNew}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                新規追加
            </button>
            {calculations.length === 0 ? (
                <p className="text-center text-gray-600">
                    保存された計算はありません。
                </p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">
                                選択
                            </th>
                            {[
                                "ポケモン名",
                                "現在のレベル",
                                "目標のレベル",
                                "EXPタイプ",
                                "性格",
                                "ブーストイベント",
                                "次のレベルまでのEXP",
                                "消費倍率",
                                "必要なアメ",
                                "必要なゆめのかけら",
                                "必要な経験値",
                                "削除",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="border border-gray-300 px-4 py-2 min-w-20"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {calculations.map((calc) => (
                            <tr key={calc.id} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={calc.includeInTotal}
                                        onChange={() =>
                                            handleCheckboxChange(calc.id)
                                        }
                                    />
                                </td>
                                {(
                                    [
                                        "pokemonName",
                                        "currentLevel",
                                        "targetLevel",
                                        "expType",
                                        "nature",
                                        "boostEvent",
                                        "expToNextLevel",
                                    ] as const
                                ).map((field) => (
                                    <td
                                        key={field}
                                        className="border border-gray-300 px-4 py-2"
                                    >
                                        {field === "expType" ||
                                        field === "nature" ||
                                        field === "boostEvent" ? (
                                            <select
                                                value={calc[field] as string}
                                                className="border rounded w-full text-center"
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        calc.id,
                                                        field,
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {field === "expType" &&
                                                    Object.entries(
                                                        expTypeToRatio,
                                                    ).map(
                                                        ([key, { label }]) => (
                                                            <option
                                                                key={key}
                                                                value={key}
                                                            >
                                                                {label}
                                                            </option>
                                                        ),
                                                    )}
                                                {field === "nature" &&
                                                    Object.entries(
                                                        natureToCandyExp,
                                                    ).map(
                                                        ([
                                                            option,
                                                            { label },
                                                        ]) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {label}
                                                            </option>
                                                        ),
                                                    )}
                                                {field === "boostEvent" &&
                                                    Object.entries(
                                                        candyBoostMultipliers,
                                                    ).map(
                                                        ([
                                                            option,
                                                            { label },
                                                        ]) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {label}
                                                            </option>
                                                        ),
                                                    )}
                                            </select>
                                        ) : (
                                            <input
                                                type={
                                                    typeof calc[field] ===
                                                    "number"
                                                        ? "number"
                                                        : "text"
                                                }
                                                value={
                                                    calc[field] as
                                                        | string
                                                        | number
                                                }
                                                className="border rounded w-full text-center"
                                                disabled={field.startsWith(
                                                    "required",
                                                )}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        calc.id,
                                                        field,
                                                        typeof calc[field] ===
                                                            "number"
                                                            ? Number(
                                                                  e.target
                                                                      .value,
                                                              )
                                                            : e.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                ))}
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="number"
                                        value={calc.customMultiplier}
                                        className="border rounded w-full text-center"
                                        disabled={calc.boostEvent !== "custom"}
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "customMultiplier",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.requiredCandy}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.requiredDreamShards}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.requiredExp}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(calc.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CalculationList;
