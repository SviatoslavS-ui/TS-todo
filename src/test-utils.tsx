import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { UserProvider } from "./contexts/UserContext";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: UserProvider, ...options });

export * from "@testing-library/react";
export { customRender as render };
