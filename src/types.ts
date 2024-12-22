import type { CandyBoostEvent, ExpType, Nature } from "./constants";

export type CalculationRecord = {
    id: string;
    pokemonName: string;
    currentLevel: number;
    targetLevel: number;
    expToNextLevel: number;
    expType: ExpType;
    nature: Nature;
    boostEvent: CandyBoostEvent;
    customMultiplier: number;
    requiredCandy: number;
    requiredDreamShards: number;
    requiredExp: number;
};
