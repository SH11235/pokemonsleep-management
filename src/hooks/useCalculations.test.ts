import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useCalculations } from "@/hooks/useCalculations";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
} from "@/lib/calculate";

// モック化
vi.mock("uuid", () => ({
    v4: () => "mocked-uuid",
}));

vi.mock("@/lib/calculate", () => ({
    calcRequiredCandy: vi.fn(() => 10),
    calcRequiredDreamShards: vi.fn(() => 100),
    calcTotalRequiredExp: vi.fn(() => 1000),
    getNextLevelExp: vi.fn(() => 100),
}));

describe("useCalculations", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
        vi.spyOn(window, "confirm").mockReturnValue(true); // window.confirm のモック
    });

    it("should initialize with empty calculations if localStorage is empty", () => {
        const { result } = renderHook(() => useCalculations());
        expect(result.current.calculations).toEqual([]);
    });

    it("should load calculations from localStorage", () => {
        const mockData = [
            {
                id: "mocked-id",
                pokemonName: "Pikachu",
                currentLevel: 5,
                targetLevel: 10,
                expToNextLevel: 100,
                expType: "600",
                nature: "normal",
                boostEvent: "none",
                customMultiplier: 1,
                requiredCandy: 10,
                requiredDreamShards: 100,
                requiredExp: 1000,
                includeInTotal: true,
            },
        ];
        localStorage.setItem("calculations", JSON.stringify(mockData));

        const { result } = renderHook(() => useCalculations());
        expect(result.current.calculations).toEqual(mockData);
    });

    it("should add a new calculation record", () => {
        const { result } = renderHook(() => useCalculations());
        act(() => {
            result.current.handleAddNew();
        });

        expect(result.current.calculations).toHaveLength(1);
        expect(result.current.calculations[0].id).toBe("mocked-uuid");
        expect(localStorage.getItem("calculations")).toContain("mocked-uuid");
    });

    it("should delete a calculation record", () => {
        const initialData = [
            {
                id: "mocked-id",
                pokemonName: "Pikachu",
                currentLevel: 5,
                targetLevel: 10,
                expToNextLevel: 100,
                expType: "600",
                nature: "normal",
                boostEvent: "none",
                customMultiplier: 1,
                requiredCandy: 10,
                requiredDreamShards: 100,
                requiredExp: 1000,
                includeInTotal: true,
            },
        ];
        localStorage.setItem("calculations", JSON.stringify(initialData));

        const { result } = renderHook(() => useCalculations());
        act(() => {
            result.current.handleDelete("mocked-id");
        });

        expect(result.current.calculations).toHaveLength(0);
        expect(localStorage.getItem("calculations")).toBe("[]");
    });

    it("should update a calculation record", () => {
        const initialData = [
            {
                id: "mocked-id",
                pokemonName: "Pikachu",
                currentLevel: 5,
                targetLevel: 10,
                expToNextLevel: 100,
                expType: "600",
                nature: "normal",
                boostEvent: "none",
                customMultiplier: 1,
                requiredCandy: 10,
                requiredDreamShards: 100,
                requiredExp: 1000,
                includeInTotal: true,
            },
        ];
        localStorage.setItem("calculations", JSON.stringify(initialData));

        const { result } = renderHook(() => useCalculations());
        act(() => {
            result.current.handleInputChange("mocked-id", "currentLevel", 6);
        });

        expect(result.current.calculations[0].currentLevel).toBe(6);
        expect(calcRequiredCandy).toHaveBeenCalled();
        expect(calcRequiredDreamShards).toHaveBeenCalled();
        expect(calcTotalRequiredExp).toHaveBeenCalled();
    });

    it("should apply custom multiplier to all custom boost records", () => {
        const initialData = [
            {
                id: "mocked-id",
                pokemonName: "Pikachu",
                currentLevel: 5,
                targetLevel: 10,
                expToNextLevel: 100,
                expType: "600",
                nature: "normal",
                boostEvent: "custom",
                customMultiplier: 1, // 初期値は 1
                requiredCandy: 10,
                requiredDreamShards: 100,
                requiredExp: 1000,
                includeInTotal: true,
            },
        ];
        localStorage.setItem("calculations", JSON.stringify(initialData));

        const { result } = renderHook(() => useCalculations());
        act(() => {
            result.current.setCustomMultiplierForAll(6); // カスタム倍率を 6 に設定
        });
        act(() => {
            result.current.handleCustomMultiplierApply(); // カスタム倍率を適用
        });

        // customMultiplier の更新を確認
        expect(result.current.calculations[0].customMultiplier).toBe(6);
        // calcRequiredDreamShards が呼び出されたことを確認
        expect(calcRequiredDreamShards).toHaveBeenCalledWith(
            expect.any(Number),
            expect.any(Number),
            expect.any(String),
            expect.any(String),
            expect.any(Number),
            6, // 適用されたカスタム倍率
            "custom",
        );
    });

    it("should update all records when boost event changes", () => {
        const initialData = [
            {
                id: "mocked-id",
                pokemonName: "Pikachu",
                currentLevel: 5,
                targetLevel: 10,
                expToNextLevel: 100,
                expType: "600",
                nature: "normal",
                boostEvent: "none",
                customMultiplier: 1,
                requiredCandy: 10,
                requiredDreamShards: 100,
                requiredExp: 1000,
                includeInTotal: true,
            },
        ];
        localStorage.setItem("calculations", JSON.stringify(initialData));

        const { result } = renderHook(() => useCalculations());
        act(() => {
            result.current.handleBoostEventChange("holidayBoost");
        });

        expect(result.current.calculations[0].boostEvent).toBe("holidayBoost");
        expect(result.current.calculations[0].customMultiplier).toBe(5); // ホリデーブーストは5倍
        expect(calcRequiredDreamShards).toHaveBeenCalled();
    });
});
