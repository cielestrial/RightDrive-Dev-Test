import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import store from "../../src/utils/store";

import MyPagination from "../../src/components/MyPagination";

describe("Pagination", () => {
  it("navigates from page 1 to page 2", async () => {
    render(
      <Provider store={store}>
        <MyPagination />
      </Provider>
    );
    // screen.debug();

    // Elements present
    expect(screen.getByRole("button", { name: "page 1" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 2" })
    ).toBeInTheDocument();

    // Trigger navigation
    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    // Elements present
    expect(
      screen.getByRole("button", { name: "Go to page 1" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "page 2" })).toBeInTheDocument();

    // screen.debug();
  });
});
