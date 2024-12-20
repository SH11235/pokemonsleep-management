import { useState, useEffect } from "react";

import type { CalculationRecord } from "@/types";

const CalculationList = () => {
    const [calculations, setCalculations] = useState<CalculationRecord[]>([]);

    useEffect(() => {
        const savedRecords = JSON.parse(
            localStorage.getItem("calculations") || "[]",
        );
        setCalculations(savedRecords);
    }, []);

    return (
        <div className="mt-6 p-6 max-w-5xl mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                計算結果テーブル
            </h2>
            {calculations.length === 0 ? (
                <p className="text-center text-gray-600">
                    保存された計算はありません。
                </p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">
                                ポケモン名
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                現在のレベル
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                目標のレベル
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                必要なアメ
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                必要なゆめのかけら
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                必要な経験値
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculations.map((calc) => (
                            <tr key={calc.id} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.pokemonName}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.currentLevel}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calc.targetLevel}
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CalculationList;
