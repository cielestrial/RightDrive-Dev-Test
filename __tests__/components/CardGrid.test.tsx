import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import store from "../../src/utils/store";

import CardGrid from "../../src/components/CardGrid";
import MyPagination from "../../src/components/MyPagination";

describe("CardGrid", () => {
  it("navigates from page 1 to page 2", async () => {
    render(
      <Provider store={store}>
        <CardGrid />
        <MyPagination />
      </Provider>
    );
    // screen.debug();

    // Elements present
    expect(screen.getByText("Crypto Name 1")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 2")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 3")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 4")).toBeInTheDocument();
    expect(screen.queryByText("Crypto Name 5")).toBeNull();
    expect(screen.queryByText("Crypto Name 6")).toBeNull();
    expect(screen.queryByText("Crypto Name 7")).toBeNull();
    expect(screen.queryByText("Crypto Name 8")).toBeNull();

    // Trigger navigation
    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    // Elements present
    expect(screen.queryByText("Crypto Name 1")).toBeNull();
    expect(screen.queryByText("Crypto Name 2")).toBeNull();
    expect(screen.queryByText("Crypto Name 3")).toBeNull();
    expect(screen.queryByText("Crypto Name 4")).toBeNull();
    expect(screen.getByText("Crypto Name 5")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 6")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 7")).toBeInTheDocument();
    expect(screen.getByText("Crypto Name 8")).toBeInTheDocument();

    // screen.debug();
  });
});
