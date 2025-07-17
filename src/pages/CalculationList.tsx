import { CalculationTable } from "@/components/CalculationTable";
import { DreamChunksForm } from "@/components/DreamChunksForm";
import { UniversalCandyForm } from "@/components/UniversalCandyForm";
import { candyBoostMultipliers } from "@/constants";
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

    const totalDreamShards = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredDreamShards, 0);

    const totalCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.requiredCandy, 0);

    const totalLackingCandy = calculations
        .filter((calc) => calc.includeInTotal)
        .reduce((sum, calc) => sum + calc.lackingCandy, 0);

    return (
        <div className="mt-6 p-6 mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                計算結果テーブル
            </h2>
            <div className="mb-4 text-lg font-semibold text-gray-700">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        アメ管理
                    </h3>
                    <UniversalCandyForm
                        requiredCandy={totalCandy}
                        totalCandy={totalCandy}
                        totalLackingCandy={totalLackingCandy}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        ゆめのかたまり管理
                    </h3>
                    <DreamChunksForm
                        requiredShards={totalDreamShards}
                        totalDreamShards={totalDreamShards}
                        totalCandy={totalCandy}
                    />
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
                <CalculationTable
                    calculations={calculations}
                    updateCalculations={updateCalculations}
                    handleInputChange={handleInputChange}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default CalculationList;
