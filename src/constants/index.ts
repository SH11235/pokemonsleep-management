export const totalExps = [
    0, 54, 125, 233, 361, 525, 727, 971, 1245, 1560, 1905, 2281, 2688, 3107,
    3536, 3976, 4430, 4899, 5382, 5879, 6394, 6931, 7489, 8068, 8668, 9290,
    9933, 10598, 11284, 11992, 12721, 13469, 14235, 15020, 15823, 16644, 17483,
    18340, 19215, 20108, 21018, 21946, 22891, 23854, 24834, 25831, 26846, 27878,
    28927, 29993, 31355, 32917, 34664, 36610, 38805, 41084, 43488, 46021, 48687,
    51493, 54358, 59280, 60257, 63286, 66363,
] as const;

export const dreamShardsPerCandy = [
    0, 14, 18, 22, 27, 30, 34, 39, 44, 48, 50, 52, 53, 56, 59, 62, 66, 68, 71,
    74, 78, 81, 85, 88, 92, 95, 100, 105, 111, 117, 122, 126, 130, 136, 143,
    151, 160, 167, 174, 184, 192, 201, 211, 221, 227, 236, 250, 264, 279, 295,
    309, 323, 338, 356, 372, 391, 437, 486, 538, 593,651,698,750, 804, 866,
] as const;

export const expTypeToRatio = {
    "600": {
        label: "一般",
        ratio: 1,
    },
    "900": {
        label: "600族",
        ratio: 1.5,
    },
    "1080": {
        label: "伝説",
        ratio: 1.8,
    },
} as const;

export const natureToCandyExp = {
    down: {
        label: "↓",
        candyExp: 21,
    },
    normal: {
        label: "-",
        candyExp: 25,
    },
    up: {
        label: "↑",
        candyExp: 30,
    },
} as const;

export const candyBoostMultipliers = {
    none: {
        multiplier: 1,
        label: "なし",
    },
    miniBoost: {
        multiplier: 4,
        label: "ミニアメブースト",
    },
    holidayBoost: {
        multiplier: 5,
        label: "2024ホリデーアメブースト",
    },
    custom: {
        multiplier: 1,
        label: "カスタム",
    },
} as const;

export type CandyBoostEvent = keyof typeof candyBoostMultipliers;
export type ExpType = keyof typeof expTypeToRatio;
export type Nature = keyof typeof natureToCandyExp;

export const pages = {
    calculator: {
        path: "/",
        name: "経験値計算",
    },
    list: {
        path: "/list",
        name: "保存済みポケモン",
    },
    privacy: {
        path: "/privacy-policy",
        name: "プライバシーポリシー",
    },
} as const;

export const dreamChunkSizes = ["S", "M", "L"] as const;
