type CustomMultiplierInputProps = {
    customMultiplier: number;
    setCustomMultiplier: (value: number) => void;
};

export const CustomMultiplierInput = ({
    customMultiplier,
    setCustomMultiplier,
}: CustomMultiplierInputProps) => (
    <div className="mb-4 text-center">
        <label htmlFor="customMultiplier" className="block mb-2 font-medium">
            ゆめのかけらカスタム消費倍率
        </label>
        <input
            id="customMultiplier"
            type="number"
            min={1}
            value={customMultiplier}
            onChange={(e) => setCustomMultiplier(Number(e.target.value))}
            className="border rounded w-16 text-center"
        />
    </div>
);
