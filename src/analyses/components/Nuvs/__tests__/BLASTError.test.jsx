import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup.tsx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NuvsBlastError from "../NuvsBlastError.tsx";

describe("<BLASTError />", () => {
    let props;

    beforeEach(() => {
        props = {
            error: "Failure. BLAST did not work.",
            onBlast: vi.fn(),
        };
    });

    it("should render error", () => {
        renderWithProviders(<NuvsBlastError {...props} />);
        expect(
            screen.getByText("Error during BLAST request."),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Failure. BLAST did not work."),
        ).toBeInTheDocument();
    });

    it("should call onBlast when retry button clicked", async () => {
        renderWithProviders(<NuvsBlastError {...props} />);
        await userEvent.click(screen.getByText("Retry"));
        expect(props.onBlast).toHaveBeenCalled();
    });
});
