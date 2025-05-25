import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { BoostEventSelector } from "./BoostEventSelector";

import { candyBoostMultipliers } from "@/constants";

describe("BoostEventSelector", () => {
    it("renders correctly", () => {
        const mockSetBoostEvent = vi.fn();
        render(
            <BoostEventSelector
                boostEvent="none"
                setBoostEvent={mockSetBoostEvent}
            />,
        );

        expect(screen.getByText("ブーストイベント")).toBeInTheDocument();
        for (const { label } of Object.values(candyBoostMultipliers)) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });

    it("calls setBoostEvent when a radio button is selected", () => {
        const mockSetBoostEvent = vi.fn();
        render(
            <BoostEventSelector
                boostEvent="none"
                setBoostEvent={mockSetBoostEvent}
            />,
        );

        const firstEventLabel = Object.values(candyBoostMultipliers)[1].label;
        const firstEventRadio = screen.getByLabelText(firstEventLabel);
        fireEvent.click(firstEventRadio);

        expect(mockSetBoostEvent).toHaveBeenCalledWith(
            Object.keys(candyBoostMultipliers)[1],
        );
    });
});
