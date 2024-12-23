import { DreamChunksForm } from "@/components/DreamChunksForm";
import {
    expTypeToRatio,
    natureToCandyExp,
    candyBoostMultipliers,
} from "@/constants";
import { useCalculations } from "@/hooks/useCalculations";

const CalculationList = () => {
    const {
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
    } = useCalculations();

    const handleCheckboxChange = (id: string) => {
        const updatedCalculations = calculations.map((calc) =>
            calc.id === id
                ? { ...calc, includeInTotal: !calc.includeInTotal }
                : calc,
        );
        updateCalculations(updatedCalculations);
    };

    const totalDreamShards = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredDreamShards, 0);

    const totalCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredCandy, 0);

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
                <DreamChunksForm requiredShards={totalDreamShards} />
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
