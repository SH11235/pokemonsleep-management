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
    return (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">選択</th>
                    {[
                        "ポケモン名",
                        "現在のレベル",
                        "目標のレベル",
                        "EXPタイプ",
                        "性格",
                        "次のレベルまでのEXP",
                        "ブーストイベント",
                        "消費倍率",
                        "必要なアメ",
                        "必要なゆめのかけら",
                        "必要な経験値",
                        "削除",
                    ].map((header) => (
                        <th
                            key={header}
                            className={`border border-gray-300 px-4 py-2 min-w-16 max-w-32 ${
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
                                onChange={() => handleCheckboxChange(calc.id)}
                            />
                        </td>
                        {(
                            [
                                "pokemonName",
                                "currentLevel",
                                "targetLevel",
                                "expType",
                                "nature",
                                "expToNextLevel",
                                "boostEvent",
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
                                            Object.entries(expTypeToRatio).map(
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
                                            ).map(([option, { label }]) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {label}
                                                </option>
                                            ))}
                                        {field === "boostEvent" &&
                                            Object.entries(
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
                                ) : (
                                    <input
                                        type={
                                            typeof calc[field] === "number"
                                                ? "number"
                                                : "text"
                                        }
                                        value={calc[field] as string | number}
                                        className="border rounded w-full text-center"
                                        disabled={field.startsWith("required")}
                                        onChange={(e) =>
                                            handleInputChange(
                                                calc.id,
                                                field,
                                                typeof calc[field] === "number"
                                                    ? Number(e.target.value)
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
    );
};
