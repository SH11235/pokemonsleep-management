import { type CandyBoostEvent, candyBoostMultipliers } from "@/constants";

export const BoostEventSelector = ({
    boostEvent,
    setBoostEvent,
}: {
    boostEvent: CandyBoostEvent;
    setBoostEvent: (value: CandyBoostEvent) => void;
}) => (
    <div className="mb-4 text-center">
        <label htmlFor="boostEvent" className="block mb-2 font-medium">
            ブーストイベント
        </label>
        <div id="boostEvent" className="flex justify-center items-center gap-4">
            {Object.entries(candyBoostMultipliers).map(([event, { label }]) => (
                <label
                    key={event}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="boostEvent"
                        id={`boostEvent-${event}`}
                        value={event}
                        checked={boostEvent === event}
                        onChange={() => setBoostEvent(event as CandyBoostEvent)}
                        className="hidden peer"
                    />
                    <span className="px-4 py-2 rounded-md border border-gray-300 peer-checked:bg-red-500 peer-checked:text-white">
                        {label}
                    </span>
                </label>
            ))}
        </div>
    </div>
);
