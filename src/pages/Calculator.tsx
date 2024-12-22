import LevelCalculator from "../components/LevelCalculator";

import { pages } from "@/constants";

const Calculator = () => (
    <div className="mt-6 p-6 max-w-xl mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">
            {pages.calculator.name}
        </h1>
        <LevelCalculator />
    </div>
);

export default Calculator;
