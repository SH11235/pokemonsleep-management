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
                    <label
                        key={type}
                        className="flex flex-row items-center gap-2"
                    >
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
                                handleCandyChange(type, Number(e.target.value))
                            }
                            className="border rounded px-2 py-1 w-16"
                            aria-labelledby={`label-universalCandy-${type}`}
                        />
                        <span className="text-gray-500 text-xs">
                            (アメ{universalCandyValues[type]}個)
                        </span>
                    </label>
                ))}

                <label className="flex flex-row md:flex-row items-center gap-2">
                    <span className="mr-2 text-gray-700" id="label-ownedCandy">
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
            </div>

            <div className="mt-4 space-y-2">
                <div className="text-gray-600 flex items-center">
                    <span id="label-ownedCandyTotal">所持アメ計算値:</span>
                    <span
                        id="value-ownedCandyTotal"
                        className="text-green-600 ml-2"
                    >
                        {calculatedOwnedCandy}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-totalRequiredCandy">必要なアメ合計値:</span>
                    <span
                        id="value-totalRequiredCandy"
                        className="text-green-600 ml-2"
                    >
                        {totalCandy}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-remainingCandy">アメ残り計算値:</span>
                    <span
                        id="value-remainingCandy"
                        className="text-green-600 ml-2"
                    >
                        {Math.max(0, calculatedOwnedCandy - requiredCandy)}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-deficitCandy">不足しているアメ計算値:</span>
                    <span id="value-deficitCandy" className="text-red-600 ml-2">
                        {Math.max(0, requiredCandy - calculatedOwnedCandy)}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-totalLackingCandy">
                        不足アメ合計値(表から):
                    </span>
                    <span
                        id="value-totalLackingCandy"
                        className="text-red-600 ml-2"
                    >
                        {totalLackingCandy}
                    </span>
                </div>
            </div>
        </div>
    );
};
