export type CalculationRecord = {
    id: string;
    pokemonName: string;
    currentLevel: number;
    targetLevel: number;
    expToNextLevel: number;
    expType: string;
    nature: string;
    boostEvent: string;
    customMultiplier: number;
    requiredCandy: number;
    requiredDreamShards: number;
    requiredExp: number;
};
