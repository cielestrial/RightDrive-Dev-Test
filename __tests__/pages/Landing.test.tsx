import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Provider } from "react-redux";
import store from "../../src/utils/store";

import Landing from "../../src/pages/Landing";

describe("Landing page", () => {
  it("checks h1 is present", () => {
    render(
      <Provider store={store}>
        <Landing />
      </Provider>
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "RightDrive Dev Test" })
    ).toBeInTheDocument();
  });
});
