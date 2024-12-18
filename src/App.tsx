import { useState } from "react";
import {
    calcRequiredCandy,
    calcRequiredDreamShards,
    calcTotalRequiredExp,
} from "./lib/calculate";
import {
    type CandyBoostEvent,
    candyBoostMultipliers,
    type ExpType,
    expTypeToRatio,
    type Nature,
    totalExps,
} from "./constants";
import { CustomMultiplierInput } from "./components/CustomMultiplierInput";
import { BoostEventSelector } from "./components/BoostEventSelector";
import { ExpTypeSelector } from "./components/ExpTypeSelector";
import { NatureSelector } from "./components/NatureSelector";

const LevelCalculator = () => {
    const [currentLevel, setCurrentLevel] = useState(10);
    const [targetLevel, setTargetLevel] = useState(11);
    const [expToNextLevel, setExpToNextLevel] = useState(
        totalExps[10] - totalExps[9],
    );
    const [expType, setExpType] = useState<ExpType>("600");
    const [nature, setNature] = useState<Nature>("normal");
    const [boostEvent, setBoostEvent] = useState<CandyBoostEvent>("none");
    const [customMultiplier, setCustomMultiplier] = useState(1);

    const requiredCandy = calcRequiredCandy(
        currentLevel,
        targetLevel,
        nature,
        expType,
        expToNextLevel,
        boostEvent,
    );
    const multiplier =
        boostEvent === "custom"
            ? customMultiplier
            : candyBoostMultipliers[boostEvent].multiplier;
    const requiredDreamShards = calcRequiredDreamShards(
        currentLevel,
        targetLevel,
        nature,
        expType,
        expToNextLevel,
        multiplier,
        boostEvent,
    );
    const requiredExp = calcTotalRequiredExp(
        currentLevel,
        targetLevel,
        expType,
        expToNextLevel,
    );

    // レベル変更時のEXPリセット処理
    const handleLevelChange = (newLevel: number) => {
        setCurrentLevel(newLevel);
        // 次のレベルまでのEXPをリセット
        const nextLevelExp =
            newLevel < totalExps.length
                ? totalExps[newLevel] - totalExps[newLevel - 1]
                : 0;
        setExpToNextLevel(nextLevelExp);
    };

    // 経験値タイプ変更時の処理
    const handleExpTypeChange = (value: ExpType) => {
        setExpType(value);
        const ratio = expTypeToRatio[value];
        setExpToNextLevel(
            Math.ceil(
                (totalExps[currentLevel] - totalExps[currentLevel - 1]) * ratio,
            ),
        );
    };

    return (
        <div className="mt-6 p-6 max-w-xl mx-auto bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">レベル管理</h1>

            <div className="flex justify-center gap-8 mb-6">
                {/* 現在のレベル */}
                <div className="text-center">
                    <label
                        htmlFor="currentLevel"
                        className="block mb-2 font-medium text-gray-700"
                    >
                        現在のレベル
                    </label>
                    <input
                        id="currentLevel"
                        type="number"
                        value={currentLevel}
                        min={1}
                        max={totalExps.length}
                        onChange={(e) =>
                            handleLevelChange(Number(e.target.value))
                        }
                        className="border rounded w-20 text-center"
                    />
                </div>

                {/* 次のレベルまでのEXP */}
                <div className="text-center">
                    <label
                        htmlFor="expToNextLevel"
                        className="block mb-2 font-medium text-gray-700"
                    >
                        次のレベルまでのEXP
                    </label>
                    <input
                        id="expToNextLevel"
                        type="number"
                        value={expToNextLevel}
                        min={0}
                        onChange={(e) =>
                            setExpToNextLevel(Number(e.target.value))
                        }
                        className="border rounded w-20 text-center"
                    />
                </div>

                {/* 目標のレベル */}
                <div className="text-center">
                    <label
                        htmlFor="targetLevel"
                        className="block mb-2 font-medium text-gray-700"
                    >
                        目標のレベル
                    </label>
                    <input
                        id="targetLevel"
                        type="number"
                        value={targetLevel}
                        min={currentLevel}
                        max={totalExps.length}
                        onChange={(e) => setTargetLevel(Number(e.target.value))}
                        className="border rounded w-20 text-center"
                    />
                </div>
            </div>

            {/* 経験値タイプ選択 */}
            <div className="mb-4 text-center">
                <ExpTypeSelector
                    expType={expType}
                    onChange={handleExpTypeChange}
                />
            </div>

            {/* 性格選択 */}
            <div className="mb-4 text-center">
                <NatureSelector nature={nature} setNature={setNature} />
            </div>

            {/* ブーストイベント選択 */}
            <BoostEventSelector
                boostEvent={boostEvent}
                setBoostEvent={setBoostEvent}
            />
            <CustomMultiplierInput
                customMultiplier={customMultiplier}
                setCustomMultiplier={setCustomMultiplier}
            />

            {/* 結果表示 */}
            <div className="mt-6 p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                    計算結果
                </h2>
                <div className="grid grid-cols-2 gap-y-4 items-center">
                    <div className="text-gray-600 text-lg text-right">
                        必要なアメ:
                    </div>
                    <div className="text-4xl font-bold text-green-700 text-left ml-2">
                        {requiredCandy}個
                    </div>

                    <div className="text-gray-600 text-lg text-right">
                        必要なゆめのかけら:
                    </div>
                    <div className="text-4xl font-bold text-green-700 text-left ml-2">
                        {requiredDreamShards}
                    </div>

                    <div className="text-gray-600 text-lg text-right">
                        必要なEXP:
                    </div>
                    <div className="text-4xl font-bold text-green-700 text-left ml-2">
                        {requiredExp}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelCalculator;
