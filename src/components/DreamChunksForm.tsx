import { dreamChunkSizes } from "@/constants";
import { useDreamChunks } from "@/hooks/useDreamChunks";

type DreamChunksFormProps = {
    requiredShards: number;
    totalDreamShards: number;
    totalCandy: number;
};

export const DreamChunksForm = ({
    requiredShards,
    totalDreamShards,
    totalCandy,
}: DreamChunksFormProps) => {
    const {
        dreamChunks,
        ownedChunks,
        handleChunkChange,
        handleOwnedChunksChange,
        calculatedOwnedDreamShards,
    } = useDreamChunks();

    return (
        <div className="text-sm mt-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                {dreamChunkSizes.map((type) => (
                    <label
                        key={type}
                        className="flex flex-row items-center gap-2"
                    >
                        <span
                            className="text-gray-700 w-24 text-right"
                            id={`label-dreamChunk-${type}`}
                        >
                            ゆめのかたまり{type}:
                        </span>
                        <input
                            id={`input-dreamChunk-${type}-count`}
                            type="number"
                            placeholder="個数"
                            value={dreamChunks[type].count}
                            onChange={(e) =>
                                handleChunkChange(
                                    type,
                                    "count",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1 w-16"
                            aria-labelledby={`label-dreamChunk-${type}`}
                        />
                        <input
                            id={`input-dreamChunk-${type}-amount`}
                            type="number"
                            placeholder="かけら量"
                            value={dreamChunks[type].amount}
                            onChange={(e) =>
                                handleChunkChange(
                                    type,
                                    "amount",
                                    Number(e.target.value),
                                )
                            }
                            className="border rounded px-2 py-1 w-20"
                            aria-labelledby={`label-dreamChunk-${type}`}
                        />
                    </label>
                ))}

                <label className="flex flex-row md:flex-row items-center gap-2">
                    <span className="mr-2 text-gray-700" id="label-ownedChunks">
                        所持しているゆめのかけら:
                    </span>
                    <input
                        id="input-ownedChunks"
                        type="number"
                        placeholder="1000000"
                        value={ownedChunks}
                        onChange={(e) =>
                            handleOwnedChunksChange(Number(e.target.value))
                        }
                        className="border rounded px-2 py-1 w-32"
                        aria-labelledby="label-ownedChunks"
                    />
                </label>
            </div>

            <div className="mt-4 space-y-2">
                <div className="text-gray-600 flex items-center">
                    <span id="label-ownedShards">所持ゆめのかけら計算値:</span>
                    <span
                        id="value-ownedShards"
                        className="text-green-600 ml-2"
                    >
                        {calculatedOwnedDreamShards}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-totalDreamShards">
                        必要なゆめのかけら合計値:
                    </span>
                    <span
                        id="value-totalDreamShards"
                        className="text-green-600 ml-2"
                    >
                        {totalDreamShards}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-remainingShards">
                        ゆめのかけら残り計算値:
                    </span>
                    <span
                        id="value-totalDreamShards"
                        className="text-green-600 ml-2"
                    >
                        {Math.max(
                            0,
                            calculatedOwnedDreamShards - requiredShards,
                        )}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-deficitShards">
                        不足しているゆめのかけら計算値:
                    </span>
                    <span
                        id="value-deficitShards"
                        className="text-red-600 ml-2"
                    >
                        {Math.max(
                            0,
                            requiredShards - calculatedOwnedDreamShards,
                        )}
                    </span>
                </div>

                <div className="text-gray-600 flex items-center">
                    <span id="label-totalCandy">使用するアメ合計値:</span>
                    <span id="value-totalCandy" className="text-green-600 ml-2">
                        {totalCandy}
                    </span>
                </div>
            </div>
        </div>
    );
};
