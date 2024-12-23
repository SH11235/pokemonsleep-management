import { render, screen, fireEvent } from "@testing-library/react";
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

        const inputs = screen.getAllByPlaceholderText("個数");
        expect((inputs[0] as HTMLInputElement).value).toBe("1"); // 初期値が 1 か確認

        expect(
            screen.getByText("所持ゆめのかけら計算値:").textContent,
        ).toContain("200");
        expect(
            screen.getByText("不足しているゆめのかけら計算値:").textContent,
        ).toContain("100");
    });

    test("should call handleChunkChange when input changes", () => {
        render(<DreamChunksForm requiredShards={300} />);

        const input = screen.getAllByPlaceholderText("個数")[0];
        fireEvent.change(input, { target: { value: "5" } });

        expect(mockHandleChunkChange).toHaveBeenCalledWith("S", "count", 5);
    });

    test("should call handleOwnedChunksChange when ownedChunks input changes", () => {
        render(<DreamChunksForm requiredShards={300} />);

        const input = screen.getByPlaceholderText("1000000");
        fireEvent.change(input, { target: { value: "80" } });

        expect(mockHandleOwnedChunksChange).toHaveBeenCalledWith(80);
    });
});
