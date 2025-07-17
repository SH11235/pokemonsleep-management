import {
    expTypeToRatio,
    natureToCandyExp,
    candyBoostMultipliers,
} from "@/constants";
import type { CalculationRecord } from "@/types";

type CalculationTableProps = {
    calculations: CalculationRecord[];
    updateCalculations: (calculations: CalculationRecord[]) => void;
    handleInputChange: (
        id: string,
        field: keyof CalculationRecord,
        value: string | number,
    ) => void;
    handleDelete: (id: string) => void;
};

export const CalculationTable = ({
    calculations,
    updateCalculations,
    handleInputChange,
    handleDelete,
}: CalculationTableProps) => {
    const handleCheckboxChange = (id: string) => {
        const updatedCalculations = calculations.map((calc) =>
            calc.id === id
                ? { ...calc, includeInTotal: !calc.includeInTotal }
                : calc,
        );
        updateCalculations(updatedCalculations);
    };

    // モバイル用カードレイアウト
    const renderMobileCards = () => (
        <div className="space-y-4 md:hidden">
            {calculations.map((calc) => (
                <div
                    key={calc.id}
                    className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                    {/* ヘッダー部 */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={calc.includeInTotal}
                                onChange={() => handleCheckboxChange(calc.id)}
                                className="w-5 h-5"
                            />
                            <input
                                type="text"
                                value={calc.pokemonName}
                                placeholder="ポケモン名"
                                className="border rounded px-2 py-1 font-semibold"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "pokemonName",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleDelete(calc.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            削除
                        </button>
                    </div>

                    {/* 入力項目 */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label
                                htmlFor={`currentLevel-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                現在Lv
                            </label>
                            <input
                                id={`currentLevel-${calc.id}`}
                                type="number"
                                value={calc.currentLevel}
                                className="border rounded w-full px-2 py-1"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "currentLevel",
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`targetLevel-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                目標Lv
                            </label>
                            <input
                                id={`targetLevel-${calc.id}`}
                                type="number"
                                value={calc.targetLevel}
                                className="border rounded w-full px-2 py-1"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "targetLevel",
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`expType-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                EXPタイプ
                            </label>
                            <select
                                id={`expType-${calc.id}`}
                                value={calc.expType}
                                className="border rounded w-full px-2 py-1 text-sm"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "expType",
                                        e.target.value,
                                    )
                                }
                            >
                                {Object.entries(expTypeToRatio).map(
                                    ([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor={`nature-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                性格
                            </label>
                            <select
                                id={`nature-${calc.id}`}
                                value={calc.nature}
                                className="border rounded w-full px-2 py-1 text-sm"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "nature",
                                        e.target.value,
                                    )
                                }
                            >
                                {Object.entries(natureToCandyExp).map(
                                    ([option, { label }]) => (
                                        <option key={option} value={option}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor={`expToNextLevel-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                次Lvまで
                            </label>
                            <input
                                id={`expToNextLevel-${calc.id}`}
                                type="number"
                                value={calc.expToNextLevel}
                                className="border rounded w-full px-2 py-1"
                                onChange={(e) =>
                                    handleInputChange(
                                        calc.id,
                                        "expToNextLevel",
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`boostEvent-${calc.id}`}
                                className="text-xs text-gray-600"
                            >
                                ブースト
                            </label>
                            <div className="flex gap-1">
                                <select
                                    id={`boostEvent-${calc.id}`}
                                    value={calc.boostEvent}
                                    className="border rounded flex-1 px-1 py-1 text-sm"
                                    onChange={(e) =>
                                        handleInputChange(
                                            calc.id,
                                            "boostEvent",
                                            e.target.value,
                                        )
                                    }
                                >
                                    {Object.entries(candyBoostMultipliers).map(
                                        ([option, { label }]) => (
                                            <option key={option} value={option}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {calc.boostEvent === "custom" && (
                                    <input
                                        type="number"
                                        value={calc.customMultiplier}
                                        className="border rounded w-12 px-1 py-1 text-sm"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "customMultiplier",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 計算結果 */}
                    <div className="border-t pt-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded p-2">
                                <div className="text-xs text-gray-600">
                                    必要アメ
                                </div>
                                <div className="font-bold text-blue-600">
                                    {calc.requiredCandy}
                                </div>
                            </div>
                            <div className="bg-green-50 rounded p-2">
                                <div className="text-xs text-gray-600">
                                    所持アメ
                                </div>
                                <input
                                    type="number"
                                    value={calc.ownedCandy ?? 0}
                                    className="border rounded w-full px-1 py-0.5"
                                    onChange={(e) =>
                                        handleInputChange(
                                            calc.id,
                                            "ownedCandy",
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="bg-red-50 rounded p-2">
                                <div className="text-xs text-gray-600">
                                    不足アメ
                                </div>
                                <div className="font-bold text-red-600">
                                    {calc.lackingCandy ?? calc.requiredCandy}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <div className="text-xs text-gray-600">
                                    かけら/EXP
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">
                                        {calc.requiredDreamShards}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                        / {calc.requiredExp}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            {/* モバイル用カードビュー */}
            {renderMobileCards()}

            {/* デスクトップ用テーブルビュー */}
            <div className="overflow-x-auto hidden md:block">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th
                                rowSpan={2}
                                className="border border-gray-300 px-2 py-2 sticky left-0 bg-gray-200"
                            >
                                選択
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-gray-300 px-4 py-2"
                            >
                                ポケモン名
                            </th>
                            <th
                                colSpan={6}
                                className="border border-gray-300 px-4 py-2"
                            >
                                入力項目
                            </th>
                            <th
                                colSpan={5}
                                className="border border-gray-300 px-4 py-2"
                            >
                                計算結果
                            </th>
                            <th
                                rowSpan={2}
                                className="border border-gray-300 px-4 py-2"
                            >
                                削除
                            </th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                現在Lv
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                目標Lv
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                EXPタイプ
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                性格
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                次Lvまで
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                ブースト/倍率
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                必要アメ
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                所持アメ
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                不足アメ
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                かけら
                            </th>
                            <th className="border border-gray-300 px-2 py-1 text-sm">
                                必要EXP
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculations.map((calc) => (
                            <tr
                                key={calc.id}
                                className="text-center hover:bg-gray-50"
                            >
                                <td className="border border-gray-300 px-2 py-2 sticky left-0 bg-white">
                                    <input
                                        type="checkbox"
                                        checked={calc.includeInTotal}
                                        onChange={() =>
                                            handleCheckboxChange(calc.id)
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="text"
                                        value={calc.pokemonName}
                                        className="border rounded w-full text-center min-w-24"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "pokemonName",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-1 py-2">
                                    <input
                                        type="number"
                                        value={calc.currentLevel}
                                        className="border rounded w-full text-center min-w-10"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "currentLevel",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-1 py-2">
                                    <input
                                        type="number"
                                        value={calc.targetLevel}
                                        className="border rounded w-full text-center min-w-10"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "targetLevel",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <select
                                        value={calc.expType}
                                        className="border rounded w-full text-center text-sm"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "expType",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {Object.entries(expTypeToRatio).map(
                                            ([key, { label }]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <select
                                        value={calc.nature}
                                        className="border rounded w-full text-center text-sm"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "nature",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {Object.entries(natureToCandyExp).map(
                                            ([option, { label }]) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <input
                                        type="number"
                                        value={calc.expToNextLevel}
                                        className="border rounded w-full text-center min-w-16"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "expToNextLevel",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <div className="flex gap-1">
                                        <select
                                            value={calc.boostEvent}
                                            className="border rounded text-center text-sm flex-1"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    calc.id,
                                                    "boostEvent",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {Object.entries(
                                                candyBoostMultipliers,
                                            ).map(([option, { label }]) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={calc.customMultiplier}
                                            className="border rounded w-8 text-center text-sm"
                                            disabled={
                                                calc.boostEvent !== "custom"
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    calc.id,
                                                    "customMultiplier",
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-2 py-2 font-semibold">
                                    {calc.requiredCandy}
                                </td>
                                <td className="border border-gray-300 px-1 py-2">
                                    <input
                                        type="number"
                                        value={calc.ownedCandy ?? 0}
                                        className="border rounded w-full text-center min-w-12"
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                "ownedCandy",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="border border-gray-300 px-2 py-2 font-semibold text-red-600">
                                    {calc.lackingCandy ?? calc.requiredCandy}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 font-semibold">
                                    {calc.requiredDreamShards}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 font-semibold">
                                    {calc.requiredExp}
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(calc.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
