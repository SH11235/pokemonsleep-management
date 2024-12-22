import { type ExpType, expTypeToRatio } from "@/constants";

export const ExpTypeSelector = ({
    expType,
    onChange,
}: { expType: ExpType; onChange: (value: ExpType) => void }) => (
    <>
        <label htmlFor="expType" className="block mb-2 font-medium">
            経験値タイプ
        </label>
        <div id="expType" className="flex justify-center items-center gap-4">
            {Object.entries(expTypeToRatio).map(([type, option]) => (
                <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="expType"
                        id={`expType-${type}`}
                        value={type}
                        checked={expType === type}
                        onChange={() => onChange(type as ExpType)}
                        className="hidden peer"
                    />
                    <span className="px-4 py-2 rounded-md border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white">
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    </>
);
