import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CalculationTable } from './CalculationTable';

import type { CalculationRecord } from '@/types';

const mockCalculations: CalculationRecord[] = [
  {
    id: '1',
    pokemonName: 'Pikachu',
    currentLevel: 5,
    targetLevel: 10,
    expType: '600',
    nature: 'normal',
    expToNextLevel: 100,
    boostEvent: 'none',
    customMultiplier: 1,
    requiredCandy: 10,
    requiredDreamShards: 5,
    requiredExp: 500,
    includeInTotal: true,
  },
];

const mockUpdateCalculations = vi.fn();
const mockHandleInputChange = vi.fn();
const mockHandleDelete = vi.fn();

describe('CalculationTable', () => {
  it('renders the table', () => {
    render(
      <CalculationTable
        calculations={mockCalculations}
        updateCalculations={mockUpdateCalculations}
        handleInputChange={mockHandleInputChange}
        handleDelete={mockHandleDelete}
      />
    );

    expect(screen.getByText('ポケモン名')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pikachu')).toBeInTheDocument();
  });

  it('handles checkbox change', () => {
    render(
      <CalculationTable
        calculations={mockCalculations}
        updateCalculations={mockUpdateCalculations}
        handleInputChange={mockHandleInputChange}
        handleDelete={mockHandleDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockUpdateCalculations).toHaveBeenCalled();
  });

  it('handles input change', () => {
    render(
      <CalculationTable
        calculations={mockCalculations}
        updateCalculations={mockUpdateCalculations}
        handleInputChange={mockHandleInputChange}
        handleDelete={mockHandleDelete}
      />
    );

    const input = screen.getByDisplayValue('Pikachu');
    fireEvent.change(input, { target: { value: 'Raichu' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('1', 'pokemonName', 'Raichu');
  });

  it('handles delete button click', () => {
    render(
      <CalculationTable
        calculations={mockCalculations}
        updateCalculations={mockUpdateCalculations}
        handleInputChange={mockHandleInputChange}
        handleDelete={mockHandleDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith('1');
  });
});
