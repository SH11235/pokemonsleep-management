import { describe, it, expect } from "vitest";

import type { ExpType, Nature, CandyBoostEvent } from "@/constants";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
    getCandyExp,
    getNextLevelExp,
} from "@/lib/calculate";

describe("test getCandyExp", () => {
    it("通常は25", () => {
        const nature: Nature = "normal";
        const event: CandyBoostEvent = "none";
        const result = getCandyExp(nature, event);
        expect(result).toBe(25);
    });

    it("アメブースト時の場合は50", () => {
        const nature: Nature = "normal";
        const event: CandyBoostEvent = "miniBoost";
        const result = getCandyExp(nature, event);
        expect(result).toBe(50);
    });

    it("経験値down性格の場合は21", () => {
        const nature: Nature = "down";
        const event: CandyBoostEvent = "none";
        const result = getCandyExp(nature, event);
        expect(result).toBe(21);
    });

    it("経験値down性格かつアメブースト時の場合は42", () => {
        const nature: Nature = "down";
        const event: CandyBoostEvent = "miniBoost";
        const result = getCandyExp(nature, event);
        expect(result).toBe(42);
    });

    it("経験値up性格の場合は30", () => {
        const nature: Nature = "up";
        const event: CandyBoostEvent = "none";
        const result = getCandyExp(nature, event);
        expect(result).toBe(30);
    });

    it("経験値up性格かつアメブースト時の場合は60", () => {
        const nature: Nature = "up";
        const event: CandyBoostEvent = "miniBoost";
        const result = getCandyExp(nature, event);
        expect(result).toBe(60);
    });
});

describe("test getNextLevelExp", () => {
    it("レベル10から11までのEXP（通常）は345", () => {
        const level = 10;
        const expType: ExpType = "600";
        const result = getNextLevelExp(level, expType);
        expect(result).toBe(345);
    });

    it("レベル10から11までのEXP（1.5倍）は518", () => {
        const level = 10;
        const expType: ExpType = "900";
        const result = getNextLevelExp(level, expType);
        expect(result).toBe(518);
    });

    it("レベル10から11までのEXP（1.8倍）は621", () => {
        const level = 10;
        const expType: ExpType = "1080";
        const result = getNextLevelExp(level, expType);
        expect(result).toBe(621);
    });

    it("レベル23から24までのEXP（1.8倍）は1042", () => {
        const level = 23;
        const expType: ExpType = "1080";
        const result = getNextLevelExp(level, expType);
        expect(result).toBe(1042);
    });

    it("レベル境界値（0 or 65）の場合は0を返す", () => {
        expect(getNextLevelExp(0, "600")).toBe(0);
        expect(getNextLevelExp(65, "600")).toBe(0);
    });
});

describe("test calcTotalRequiredExp", () => {
    it("レベル10から11までのEXP（通常）は345", () => {
        const currentLevel = 10;
        const targetLevel = 11;
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const result = calcTotalRequiredExp(
            currentLevel,
            targetLevel,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(345);
    });

    it("レベル23から30までのEXP（1.8倍）は4256", () => {
        const currentLevel = 23;
        const targetLevel = 30;
        const expType: ExpType = "1080";
        const expToNextLevel = 1042;
        const result = calcTotalRequiredExp(
            currentLevel,
            targetLevel,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(8106);
    });

    it("レベル37から50までのEXP（1.8倍）は22522", () => {
        const currentLevel = 37;
        const targetLevel = 50;
        const expType: ExpType = "1080";
        const expToNextLevel = 1547;
        const result = calcTotalRequiredExp(
            currentLevel,
            targetLevel,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(22522);
    });

    it("currentLevelがtargetLevel以上の場合は0を返す", () => {
        const currentLevel = 10;
        const targetLevel = 10;
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const result = calcTotalRequiredExp(
            currentLevel,
            targetLevel,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(0);
    });
});

describe("test calcRequiredCandy", () => {
    it("レベル10から11までの必要アメ数（通常）は14", () => {
        const currentLevel = 10;
        const targetLevel = 11;
        const nature: Nature = "normal";
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(14);
    });

    it("レベル10から11までの必要アメ数（通常・アメブースト）は7", () => {
        const currentLevel = 10;
        const targetLevel = 11;
        const nature: Nature = "normal";
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const event: CandyBoostEvent = "miniBoost";
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            event,
        );
        expect(result).toBe(7);
    });

    it("レベル23から30までの必要アメ数（1.8倍・アメブースト）は101", () => {
        const currentLevel = 23;
        const targetLevel = 30;
        const nature: Nature = "normal";
        const expType: ExpType = "1080";
        const expToNextLevel = 1042;
        const event: CandyBoostEvent = "miniBoost";
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            event,
        );
        expect(result).toBe(163);
    });

    it("レベル37から50までの必要アメ数（経験値down・1.8倍）は1073", () => {
        const currentLevel = 37;
        const targetLevel = 50;
        const nature: Nature = "down";
        const expType: ExpType = "1080";
        const expToNextLevel = 1547;
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(1073);
    });

    it("レベル37から50までの必要アメ数（経験値down・1.8倍・アメブースト）は537", () => {
        const currentLevel = 37;
        const targetLevel = 50;
        const nature: Nature = "down";
        const expType: ExpType = "1080";
        const expToNextLevel = 1547;
        const event: CandyBoostEvent = "miniBoost";
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            event,
        );
        expect(result).toBe(537);
    });

    it("currentLevelがtargetLevel以上の場合は0を返す", () => {
        const currentLevel = 10;
        const targetLevel = 10;
        const nature: Nature = "normal";
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const result = calcRequiredCandy(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
        );
        expect(result).toBe(0);
    });
});

describe("test calcRequiredDreamShards", () => {
    it("レベル10から11までの必要夢のかけら数（通常）は700", () => {
        const currentLevel = 10;
        const targetLevel = 11;
        const nature: Nature = "normal";
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const multiplier = 1;
        const event: CandyBoostEvent = "none";
        const result = calcRequiredDreamShards(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            multiplier,
            event,
        );
        expect(result).toBe(700);
    });

    it("レベル10から11までの必要夢のかけら数（通常・ミニアメブースト）は1400", () => {
        const currentLevel = 10;
        const targetLevel = 11;
        const nature: Nature = "normal";
        const expType: ExpType = "600";
        const expToNextLevel = 345;
        const multiplier = 4;
        const event: CandyBoostEvent = "miniBoost";
        const result = calcRequiredDreamShards(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            multiplier,
            event,
        );
        expect(result).toBe(1400);
    });

    it("レベル23から30までの必要夢のかけら数（1.8倍・ミニアメブースト）は66396", () => {
        const currentLevel = 23;
        const targetLevel = 30;
        const nature: Nature = "normal";
        const expType: ExpType = "1080";
        const expToNextLevel = 1042;
        const multiplier = 4;
        const event: CandyBoostEvent = "miniBoost";
        const result = calcRequiredDreamShards(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            multiplier,
            event,
        );
        expect(result).toBe(66396);
    });

    it("レベル37から50までの必要夢のかけら数（経験値down・1.8倍・ミニアメブースト）は242194", () => {
        const currentLevel = 37;
        const targetLevel = 50;
        const nature: Nature = "down";
        const expType: ExpType = "1080";
        const expToNextLevel = 1547;
        const multiplier = 1;
        const event: CandyBoostEvent = "none";
        const result = calcRequiredDreamShards(
            currentLevel,
            targetLevel,
            nature,
            expType,
            expToNextLevel,
            multiplier,
            event,
        );
        expect(result).toBe(242194);
    });
});
