import { afterEach, describe, expect, test } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { Calculator } from "../Calculator";

describe("Calculator [COMPONENT]", () => {
  test("should render calculator Card with default values", () => {
    render(<Calculator />);

    const card = screen.getByTestId("calculator-card");

    const amountText = within(card).getByText("Suma incasat lunar (RON)");
    const amountInput = within(card).getByTestId("card-income-input");

    const accountantText = within(card).getByText("Contabilitate (RON)");
    const accountantInput = within(card).getByTestId("card-accountant-input");

    const expensesText = within(card).getByText("Cheltuieli deductibile (RON)");
    const expensesInput = within(card).getByTestId("card-expenses-input");

    const calculateButton = within(card).getByRole("button");

    expect(amountText).toBeDefined();
    expect(accountantText).toBeDefined();
    expect(expensesText).toBeDefined();

    expect(amountInput).toHaveAttribute("placeholder", "10000");
    expect(accountantInput).toHaveValue(0);
    expect(expensesInput).toHaveValue(0);

    expect(calculateButton).toHaveTextContent("Calculeaza");
  });
});
