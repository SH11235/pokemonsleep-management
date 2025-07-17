import { dreamChunkSizes } from "@/constants";
import { useDreamChunks } from "@/hooks/useDreamChunks";

type DreamChunksFormProps = {
    requiredShards: number;
    totalDreamShards: number;
};

export const DreamChunksForm = ({
    requiredShards,
    totalDreamShards,
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
            <div className="space-y-4">
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
                </div>

                <label className="flex flex-row items-center gap-2">
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

            <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3 text-sm">
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            所持かけら計算値
                        </div>
                        <div className="text-green-600 font-semibold text-lg">
                            {calculatedOwnedDreamShards.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            必要かけら合計
                        </div>
                        <div className="text-blue-600 font-semibold text-lg">
                            {totalDreamShards.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            かけら残り計算値
                        </div>
                        <div className="text-green-600 font-semibold text-lg">
                            {Math.max(
                                0,
                                calculatedOwnedDreamShards - requiredShards,
                            ).toLocaleString()}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-600 text-xs">
                            不足かけら計算値
                        </div>
                        <div className="text-red-600 font-bold text-xl">
                            {Math.max(
                                0,
                                requiredShards - calculatedOwnedDreamShards,
                            ).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
