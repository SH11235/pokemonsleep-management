import { dreamChunkSizes } from "@/constants";
import { useDreamChunks } from "@/hooks/useDreamChunks";

type DreamChunksFormProps = {
    requiredShards: number;
};

export const DreamChunksForm = ({ requiredShards }: DreamChunksFormProps) => {
    const {
        dreamChunks,
        ownedChunks,
        handleChunkChange,
        handleOwnedChunksChange,
        calculateOwnedDreamShards,
    } = useDreamChunks();

    const ownedShards = calculateOwnedDreamShards();
    const deficitShards = Math.max(0, requiredShards - ownedShards);

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

            <div className="mt-4">
                <span className="block text-gray-600" id="label-ownedShards">
                    所持ゆめのかけら計算値:{" "}
                    <span className="text-green-600" id="value-ownedShards">
                        {ownedShards}
                    </span>
                </span>
                <span
                    className="block text-gray-600 mt-2"
                    id="label-deficitShards"
                >
                    不足しているゆめのかけら計算値:{" "}
                    <span className="text-red-600" id="value-deficitShards">
                        {deficitShards}
                    </span>
                </span>
            </div>
        </div>
    );
};
