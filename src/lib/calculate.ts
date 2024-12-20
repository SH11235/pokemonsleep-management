import {
    type ExpType,
    expTypeToRatio,
    totalExps,
    type Nature,
    type CandyBoostEvent,
    natureToCandyExp,
    dreamShardsPerCandy,
} from "@/constants";

export const getCandyExp = (nature: Nature, event: CandyBoostEvent): number => {
    return event === "none"
        ? natureToCandyExp[nature]
        : natureToCandyExp[nature] * 2;
};

/**
 * レベル間の必要経験値の差分を計算する関数
 */
export const getNextLevelExp = (level: number, expType: ExpType): number => {
    if (level < 1 || level >= totalExps.length) {
        return 0;
    }
    const ratio = expTypeToRatio[expType];
    return Math.round((totalExps[level] - totalExps[level - 1]) * ratio);
};

export const calcTotalRequiredExp = (
    currentLevel: number,
    targetLevel: number,
    expType: ExpType,
    expToNextLevel: number,
): number => {
    if (currentLevel >= targetLevel) {
        return 0;
    }
    const ratio = expTypeToRatio[expType];
    const currentExp =
        Math.round(totalExps[currentLevel - 1] * ratio) +
        getNextLevelExp(currentLevel, expType) -
        expToNextLevel;
    const targetExp = Math.round(totalExps[targetLevel - 1] * ratio);
    return targetExp - currentExp;
};

export const calcRequiredCandy = (
    currentLevel: number,
    targetLevel: number,
    nature: Nature,
    expType: ExpType,
    expToNextLevel: number,
    event: CandyBoostEvent = "none",
): number => {
    const requiredExp = calcTotalRequiredExp(
        currentLevel,
        targetLevel,
        expType,
        expToNextLevel,
    );
    const candyExp = getCandyExp(nature, event);
    return Math.ceil(requiredExp / candyExp);
};

export const calcRequiredDreamShards = (
    currentLevel: number,
    targetLevel: number,
    nature: Nature,
    expType: ExpType,
    expToNextLevel: number,
    multiplier: number,
    event: CandyBoostEvent = "none",
): number => {
    if (currentLevel >= targetLevel || targetLevel > totalExps.length) {
        return 0;
    }
    const candyExp = getCandyExp(nature, event);
    let dreamShardsSum = 0;
    let carry = 0;
    for (let level = currentLevel; level < targetLevel; level++) {
        const requiredExp =
            level === currentLevel
                ? expToNextLevel
                : getNextLevelExp(level, expType) - carry;
        const requiredCandy = Math.ceil(requiredExp / candyExp);
        dreamShardsSum += dreamShardsPerCandy[level] * requiredCandy;
        // 余剰経験値（carry）の計算
        carry = candyExp * requiredCandy - requiredExp;
    }
    return dreamShardsSum * multiplier;
};
