import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    expTypeToRatio,
    natureToCandyExp,
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

const CalculationList = () => {
    const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
    const [selectedBoostEvent, setSelectedBoostEvent] = useState("none");
    const [customMultiplierForAll, setCustomMultiplierForAll] =
        useState<number>(1);
    const [dreamChunks, setDreamChunks] = useState(() => {
        const savedDreamChunks = localStorage.getItem("dreamChunks");
        return savedDreamChunks
            ? JSON.parse(savedDreamChunks)
            : {
                  S: { count: 0, amount: 0 },
                  M: { count: 0, amount: 0 },
                  L: { count: 0, amount: 0 },
              };
    });
    const [ownedChunks, setOwnedChunks] = useState(() => {
        const savedOwnedChunks = localStorage.getItem("ownedChunks");
        return savedOwnedChunks ? Number(savedOwnedChunks) : 0;
    });

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
        const savedDreamChunks = localStorage.getItem("dreamChunks");
        const savedOwnedChunks = localStorage.getItem("ownedChunks");
        if (savedDreamChunks) {
            setDreamChunks(JSON.parse(savedDreamChunks));
        }
        if (savedOwnedChunks) {
            setOwnedChunks(Number(savedOwnedChunks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("dreamChunks", JSON.stringify(dreamChunks));
        localStorage.setItem("ownedChunks", ownedChunks.toString());
    }, [dreamChunks, ownedChunks]);

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

    const totalCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredCandy, 0);

    const calculateOwnedDreamShards = () => {
        const totalChunks =
            dreamChunks.S.count * dreamChunks.S.amount +
            dreamChunks.M.count * dreamChunks.M.amount +
            dreamChunks.L.count * dreamChunks.L.amount +
            ownedChunks;
        return totalChunks;
    };

    const calculateDeficit = () => {
        const ownedShards = calculateOwnedDreamShards();
        return Math.max(0, totalDreamShards - ownedShards);
    };

    const handleChunkChange = (
        type: "S" | "M" | "L",
        field: "count" | "amount",
        value: number,
    ) => {
        setDreamChunks(
            (prev: { [x: string]: { count: number; amount: number } }) => ({
                ...prev,
                [type]: { ...prev[type], [field]: value },
            }),
        );
    };

    const handleOwnedChunksChange = (value: number) => {
        setOwnedChunks(value);
    };

    const ownedDreamShards = calculateOwnedDreamShards();
    const deficitDreamShards = calculateDeficit();

    return (
        <div className="mt-6 p-6 mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                計算結果テーブル
            </h2>
            <div className="mb-4 text-lg font-semibold text-gray-700">
                必要なゆめのかけら合計値:{" "}
                <span className="text-green-600 mr-4">{totalDreamShards}</span>
                使用するアメ合計値:{" "}
                <span className="text-green-600">{totalCandy}</span>
                <div className="text-sm mt-4">
                    <label className="block mb-2">
                        <span className="mr-2">ゆめのかたまりS:</span>
                        <input
                            type="number"
                            placeholder="個数"
                            value={dreamChunks.S.count}
                            onChange={(e) =>
                                handleChunkChange(
                                    "S",
                                    "count",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="number"
                            placeholder="かけら量"
                            value={dreamChunks.S.amount}
                            onChange={(e) =>
                                handleChunkChange(
                                    "S",
                                    "amount",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </label>

                    <label className="block mb-2">
                        <span className="mr-2">ゆめのかたまりM:</span>
                        <input
                            type="number"
                            placeholder="個数"
                            value={dreamChunks.M.count}
                            onChange={(e) =>
                                handleChunkChange(
                                    "M",
                                    "count",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="number"
                            placeholder="かけら量"
                            value={dreamChunks.M.amount}
                            onChange={(e) =>
                                handleChunkChange(
                                    "M",
                                    "amount",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </label>

                    <label className="block mb-2">
                        <span className="mr-2">ゆめのかたまりL:</span>
                        <input
                            type="number"
                            placeholder="個数"
                            value={dreamChunks.L.count}
                            onChange={(e) =>
                                handleChunkChange(
                                    "L",
                                    "count",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="number"
                            placeholder="かけら量"
                            value={dreamChunks.L.amount}
                            onChange={(e) =>
                                handleChunkChange(
                                    "L",
                                    "amount",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="mr-2">所持しているゆめのかけら: </span>
                        <input
                            type="number"
                            placeholder="1000000"
                            value={ownedChunks}
                            onChange={(e) =>
                                handleOwnedChunksChange(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1"
                        />
                    </label>

                    <div className="mb-4">
                        <span className="block text-gray-600">
                            所持ゆめのかけら計算値:{" "}
                            <span className="text-green-600">
                                {ownedDreamShards}
                            </span>
                        </span>
                        <span className="block text-gray-600">
                            不足しているゆめのかけら計算値:{" "}
                            <span className="text-red-600">
                                {deficitDreamShards}
                            </span>
                        </span>
                    </div>
                </div>
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
                {selectedBoostEvent === "custom" && (
                    <div className="mt-4">
                        <label
                            htmlFor="customMultiplier"
                            className="block mb-2 text-gray-700"
                        >
                            カスタム倍率を一括設定:
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                id="customMultiplier"
                                type="number"
                                value={customMultiplierForAll}
                                onChange={(e) =>
                                    setCustomMultiplierForAll(
                                        Number(e.target.value),
                                    )
                                }
                                className="border rounded w-32 p-2"
                            />
                            <button
                                type="button"
                                onClick={handleCustomMultiplierApply}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                適用
                            </button>
                        </div>
                    </div>
                )}
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
                                    className={`border border-gray-300 px-4 py-2 min-w-16 ${
                                        header === "現在のレベル" ||
                                        header === "目標のレベル" ||
                                        header === "消費倍率" ||
                                        header === "次のレベルまでのEXP" ||
                                        header === "必要なアメ"
                                            ? "w-20"
                                            : ""
                                    }`}
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
