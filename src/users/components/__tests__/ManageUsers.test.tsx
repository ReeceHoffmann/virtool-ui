import { AdministratorRoleName } from "@administration/types";
import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeUsers, mockApiFindUsers } from "@tests/fake/user";
import { renderWithRouter } from "@tests/setup";
import { forEach } from "lodash-es";
import React from "react";
import { describe, expect, it } from "vitest";
import { ManageUsers } from "../ManageUsers";

describe("<ManageUsers />", () => {
    it("should render correctly with 3 users", async () => {
        const users = createFakeUsers(3);
        users[0].administrator_role = AdministratorRoleName.FULL;
        await mockApiFindUsers(users);
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        renderWithRouter(<ManageUsers />);

        expect(await screen.findByLabelText("search")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Create" }),
        ).toBeInTheDocument();
        expect(await screen.findByText(/Administrator/)).toBeInTheDocument();
        forEach(users, (user) => {
            expect(screen.getByText(user.handle)).toBeInTheDocument();
        });
    });

    it("should render correctly when documents = null", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        renderWithRouter(<ManageUsers />);

        expect(await screen.findByLabelText("search")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });

    it("should render correctly if account has insufficient permissions", async () => {
        const users = createFakeUsers(3);

        mockApiFindUsers(users);
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));

        renderWithRouter(<ManageUsers />);

        expect(
            await screen.findByText(
                "You do not have permission to manage users.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Contact an administrator."),
        ).toBeInTheDocument();
        expect(screen.queryByText(users[0].handle)).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Create" }),
        ).not.toBeInTheDocument();
        expect(screen.queryByLabelText("search")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });
});
