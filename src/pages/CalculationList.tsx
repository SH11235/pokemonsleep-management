import { useState } from "react";
import { CalculationTable } from "@/components/CalculationTable";
import { DreamChunksForm } from "@/components/DreamChunksForm";
import { UniversalCandyForm } from "@/components/UniversalCandyForm";
import { candyBoostMultipliers } from "@/constants";
import { useCalculations } from "@/hooks/useCalculations";

const CalculationList = () => {
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isManagementExpanded, setIsManagementExpanded] = useState(false);

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

    const totalDreamShards = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredDreamShards, 0);

    const totalCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredCandy, 0);

    const totalLackingCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce(
            (sum, calc) => sum + (calc.lackingCandy ?? calc.requiredCandy),
            0,
        );

    return (
        <div className="mt-6 p-6 mx-auto bg-white shadow rounded relative">
            {/* モバイル用スティッキーサマリー */}
            <div className="md:hidden sticky top-0 -mx-6 -mt-6 mb-4 bg-white border-b border-gray-200 shadow-sm z-10">
                <button
                    type="button"
                    className="w-full text-left p-4 flex items-center justify-between cursor-pointer bg-transparent border-none"
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                >
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="text-xs text-gray-600">
                                不足アメ合計
                            </div>
                            <div className="text-xl font-bold text-red-600">
                                {totalLackingCandy}
                            </div>
                        </div>
                        <div className="border-l pl-4">
                            <div className="text-xs text-gray-600">
                                必要アメ合計
                            </div>
                            <div className="text-lg font-semibold text-blue-600">
                                {totalCandy}
                            </div>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        {isSummaryExpanded ? "▲" : "▼"}
                    </div>
                </button>

                {/* 展開時の詳細情報 */}
                {isSummaryExpanded && (
                    <div className="px-4 pb-4 border-t bg-gray-50">
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                                <div className="text-xs text-gray-600">
                                    必要かけら
                                </div>
                                <div className="font-semibold">
                                    {totalDreamShards.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsManagementExpanded(!isManagementExpanded);
                            }}
                            className="mt-3 text-blue-600 text-sm underline"
                        >
                            {isManagementExpanded
                                ? "管理画面を閉じる"
                                : "アメ・かたまり管理を開く"}
                        </button>
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                {isManagementExpanded ? "リソース管理" : "計算結果テーブル"}
            </h2>

            {/* PC表示 or モバイルで管理画面展開時 */}
            <div
                className={`mb-4 ${!isManagementExpanded ? "hidden md:block" : ""}`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-gray-700 mb-3">
                            アメ管理
                        </h3>
                        <UniversalCandyForm
                            requiredCandy={totalCandy}
                            totalCandy={totalCandy}
                            totalLackingCandy={totalLackingCandy}
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-gray-700 mb-3">
                            ゆめのかたまり管理
                        </h3>
                        <DreamChunksForm
                            requiredShards={totalDreamShards}
                            totalDreamShards={totalDreamShards}
                        />
                    </div>
                </div>
            </div>
            {/* モバイルでは管理画面展開時のみ表示 */}
            <div
                className={`mb-4 ${isManagementExpanded ? "" : "hidden md:block"}`}
            >
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
            {/* モバイルでは管理画面表示中はテーブルを非表示 */}
            <div className={isManagementExpanded ? "hidden" : ""}>
                {calculations.length === 0 ? (
                    <p className="text-center text-gray-600">
                        保存された計算はありません。
                    </p>
                ) : (
                    <CalculationTable
                        calculations={calculations}
                        updateCalculations={updateCalculations}
                        handleInputChange={handleInputChange}
                        handleDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default CalculationList;
