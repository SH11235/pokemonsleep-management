import { render, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";

import { DreamChunksForm } from "@/components/DreamChunksForm";
import { useDreamChunks } from "@/hooks/useDreamChunks";

// useDreamChunks をモック
vi.mock("@/hooks/useDreamChunks", () => ({
    useDreamChunks: vi.fn(),
}));

describe("DreamChunksForm", () => {
    const mockHandleChunkChange = vi.fn();
    const mockHandleOwnedChunksChange = vi.fn();
    const mockCalculateOwnedDreamShards = vi.fn(() => 200);

    beforeEach(() => {
        // useDreamChunks フックが返す値を設定
        (useDreamChunks as Mock).mockReturnValue({
            dreamChunks: {
                S: { count: 1, amount: 200 },
                M: { count: 0, amount: 0 },
                L: { count: 0, amount: 0 },
            },
            ownedChunks: 0,
            handleChunkChange: mockHandleChunkChange,
            handleOwnedChunksChange: mockHandleOwnedChunksChange,
            calculateOwnedDreamShards: mockCalculateOwnedDreamShards,
        });
    });

    test("should display initial values", () => {
        render(<DreamChunksForm requiredShards={300} />);

        // "S" の個数と量の初期値確認
        const countInput = document.getElementById(
            "input-dreamChunk-S-count",
        ) as HTMLInputElement;
        expect(countInput.value).toBe("1"); // 初期値が 1 か確認

        const ownedShards = document.getElementById("value-ownedShards");
        expect(ownedShards?.textContent).toBe("200");

        const deficitShards = document.getElementById("value-deficitShards");
        expect(deficitShards?.textContent).toBe("100");
    });

    test("should call handleChunkChange when input changes", () => {
        render(<DreamChunksForm requiredShards={300} />);

        // "S" の個数を変更
        const countInput = document.getElementById(
            "input-dreamChunk-S-count",
        ) as HTMLInputElement;
        fireEvent.change(countInput, { target: { value: "5" } });

        // モック関数の呼び出しを確認
        expect(mockHandleChunkChange).toHaveBeenCalledWith("S", "count", 5);
    });

    test("should call handleOwnedChunksChange when ownedChunks input changes", () => {
        render(<DreamChunksForm requiredShards={300} />);

        // 所持ゆめのかけらを変更
        const ownedInput = document.getElementById(
            "input-ownedChunks",
        ) as HTMLInputElement;
        fireEvent.change(ownedInput, { target: { value: "80" } });

        // モック関数の呼び出しを確認
        expect(mockHandleOwnedChunksChange).toHaveBeenCalledWith(80);
    });
});
