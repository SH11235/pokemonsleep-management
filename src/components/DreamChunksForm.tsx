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
            {dreamChunkSizes.map((type) => (
                <label key={type} className="block mb-2">
                    <span className="mr-2">ゆめのかたまり{type}:</span>
                    <input
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
                        className="border rounded px-2 py-1"
                    />
                    <input
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
                        className="border rounded px-2 py-1 ml-2"
                    />
                </label>
            ))}

            <label className="block mb-4">
                <span className="mr-2">所持しているゆめのかけら:</span>
                <input
                    type="number"
                    placeholder="1000000"
                    value={ownedChunks}
                    onChange={(e) =>
                        handleOwnedChunksChange(Number(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                />
            </label>

            <div className="mb-4">
                <span className="block text-gray-600">
                    所持ゆめのかけら計算値:{" "}
                    <span className="text-green-600">{ownedShards}</span>
                </span>
                <span className="block text-gray-600">
                    不足しているゆめのかけら計算値:{" "}
                    <span className="text-red-600">{deficitShards}</span>
                </span>
            </div>
        </div>
    );
};
