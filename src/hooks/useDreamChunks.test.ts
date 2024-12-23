import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { useDreamChunks } from "@/hooks/useDreamChunks";

describe("useDreamChunks", () => {
    beforeEach(() => {
        // localStorage をモック
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: vi.fn(() => null),
                setItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });

        localStorage.clear(); // 必要なら初期化
    });

    test("should initialize with default values", () => {
        const { result } = renderHook(() => useDreamChunks());
        expect(result.current.dreamChunks).toEqual({
            S: { count: 0, amount: 0 },
            M: { count: 0, amount: 0 },
            L: { count: 0, amount: 0 },
        });
        expect(result.current.ownedChunks).toBe(0);
    });

    test("should update dreamChunks and save to localStorage", () => {
        const { result } = renderHook(() => useDreamChunks());
        act(() => {
            result.current.handleChunkChange("S", "count", 5);
        });
        expect(result.current.dreamChunks.S.count).toBe(5);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "dreamChunks",
            JSON.stringify({
                S: { count: 5, amount: 0 },
                M: { count: 0, amount: 0 },
                L: { count: 0, amount: 0 },
            }),
        );
    });

    test("should update ownedChunks and save to localStorage", () => {
        const { result } = renderHook(() => useDreamChunks());
        act(() => {
            result.current.handleOwnedChunksChange(100);
        });
        expect(result.current.ownedChunks).toBe(100);
        expect(localStorage.setItem).toHaveBeenCalledWith("ownedChunks", "100");
    });

    test("should calculate total owned dream shards correctly", () => {
        const { result } = renderHook(() => useDreamChunks());
        act(() => {
            result.current.handleChunkChange("S", "count", 2);
            result.current.handleChunkChange("S", "amount", 50);
            result.current.handleChunkChange("M", "count", 3);
            result.current.handleChunkChange("M", "amount", 100);
        });
        expect(result.current.calculateOwnedDreamShards()).toBe(
            2 * 50 + 3 * 100,
        );
    });
});
