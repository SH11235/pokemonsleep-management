import { type Nature, natureToCandyExp } from "@/constants";

export const NatureSelector = ({
    nature,
    setNature,
}: { nature: Nature; setNature: (value: Nature) => void }) => (
    <>
        <label htmlFor="nature" className="block mb-2 font-medium">
            性格
        </label>
        <div id="nature" className="flex justify-center items-center gap-4">
            {Object.entries(natureToCandyExp).map(([key, value]) => (
                <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="nature"
                        id={`nature-${key}`}
                        value={key}
                        checked={nature === key}
                        onChange={() => setNature(key as Nature)}
                        className="hidden peer"
                    />
                    <span className="px-4 py-2 rounded-md border border-gray-300 peer-checked:bg-green-500 peer-checked:text-white">
                        {value.label}
                    </span>
                </label>
            ))}
        </div>
    </>
);
