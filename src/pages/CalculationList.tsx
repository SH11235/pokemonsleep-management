import { useState, useEffect } from "react";

import {
    expTypeToRatio,
    natureToCandyExp,
    candyBoostMultipliers,
} from "@/constants";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
} from "@/lib/calculate";
import type { CalculationRecord } from "@/types";

const CalculationList = () => {
    const [calculations, setCalculations] = useState<CalculationRecord[]>([]);

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

            const updatedCalc = { ...calc, [field]: value };

            // 再計算
            const multiplier =
                updatedCalc.boostEvent === "custom"
                    ? updatedCalc.customMultiplier
                    : candyBoostMultipliers[updatedCalc.boostEvent].multiplier;

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
                updatedCalc.boostEvent,
            );

            updatedCalc.requiredDreamShards = calcRequiredDreamShards(
                updatedCalc.currentLevel,
                updatedCalc.targetLevel,
                updatedCalc.nature,
                updatedCalc.expType,
                updatedCalc.expToNextLevel,
                multiplier,
                updatedCalc.boostEvent,
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
                                "カスタム倍率",
                                "必要なアメ",
                                "必要なゆめのかけら",
                                "必要な経験値",
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
                                        "customMultiplier",
                                        "requiredCandy",
                                        "requiredDreamShards",
                                        "requiredExp",
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CalculationList;
