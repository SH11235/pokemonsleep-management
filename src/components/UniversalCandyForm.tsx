import { universalCandySizes, universalCandyValues } from "@/constants";
import { useUniversalCandy } from "@/hooks/useUniversalCandy";

type UniversalCandyFormProps = {
    requiredCandy: number;
    totalCandy: number;
    totalLackingCandy: number;
};

export const UniversalCandyForm = ({
    requiredCandy,
    totalCandy,
    totalLackingCandy,
}: UniversalCandyFormProps) => {
    const {
        universalCandy,
        ownedCandy,
        handleCandyChange,
        handleOwnedCandyChange,
        calculatedOwnedCandy,
    } = useUniversalCandy();

    return (
        <div className="text-sm mt-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                {universalCandySizes.map((type) => (
                    <div key={type} className="flex flex-col gap-1">
                        <label className="flex flex-row items-center gap-2">
                            <span
                                className="text-gray-700 w-24 text-right"
                                id={`label-universalCandy-${type}`}
                            >
                                ばんのうアメ{type}:
                            </span>
                            <input
                                id={`input-universalCandy-${type}`}
                                type="number"
                                placeholder="個数"
                                value={universalCandy[type].count}
                                onChange={(e) =>
                                    handleCandyChange(
                                        type,
                                        Number(e.target.value),
                                    )
                                }
                                className="border rounded px-2 py-1 w-16"
                                aria-labelledby={`label-universalCandy-${type}`}
                            />
                        </label>
                        <p className="text-xs text-gray-500 text-center ml-24">
                            ※アメ{universalCandyValues[type]}個分
                        </p>
                    </div>
                ))}

                <div className="flex flex-col gap-2">
                    <label className="flex flex-row md:flex-row items-center gap-2">
                        <span
                            className="mr-2 text-gray-700"
                            id="label-ownedCandy"
                        >
                            所持しているアメ:
                        </span>
                        <input
                            id="input-ownedCandy"
                            type="number"
                            placeholder="100"
                            value={ownedCandy}
                            onChange={(e) =>
                                handleOwnedCandyChange(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1 w-24"
                            aria-labelledby="label-ownedCandy"
                        />
                    </label>
                    <p className="text-xs text-gray-500 ml-2">
                        ※タイプアメ（25個分）の調整用
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 text-sm">
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            所持アメ計算値
                        </div>
                        <div className="text-green-600 font-semibold text-lg">
                            {calculatedOwnedCandy}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            必要アメ合計
                        </div>
                        <div className="text-blue-600 font-semibold text-lg">
                            {totalCandy}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            アメ残り計算値
                        </div>
                        <div className="text-green-600 font-semibold text-lg">
                            {Math.max(
                                0,
                                calculatedOwnedCandy - totalLackingCandy,
                            )}
                        </div>
                    </div>
                    <div className="text-center col-span-2 md:col-span-3 lg:col-span-4">
                        <div className="text-gray-600 text-xs mb-2">
                            不足アメ
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-right pr-2 border-r border-gray-300">
                                <div className="text-gray-500 text-xs">
                                    計算値
                                </div>
                                <div className="text-red-600 font-semibold text-lg">
                                    {Math.max(
                                        0,
                                        totalLackingCandy -
                                            calculatedOwnedCandy,
                                    )}
                                </div>
                            </div>
                            <div className="text-left pl-2">
                                <div className="text-gray-500 text-xs">
                                    ばんのうアメ未使用時
                                </div>
                                <div className="text-red-600 font-semibold text-lg">
                                    {totalLackingCandy}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
