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
        <div className="overflow-x-auto">
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
                                            <option key={option} value={option}>
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
                                            <option key={option} value={option}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={calc.customMultiplier}
                                        className="border rounded w-8 text-center text-sm"
                                        disabled={calc.boostEvent !== "custom"}
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
    );
};
