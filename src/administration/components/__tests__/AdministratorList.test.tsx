import { AdministratorRoleName } from "@administration/types";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    mockGetAdministratorRoles,
    mockSetAdministratorRoleAPI,
} from "@tests/fake/administrator";
import {
    createFakeUser,
    createFakeUsers,
    mockApiFindUsers,
} from "@tests/fake/user";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import ManageAdministrators from "../AdministratorList";

describe("<Administrators>", () => {
    it("should render", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const users = createFakeUsers(2);
        users[0].administrator_role = AdministratorRoleName.FULL;
        users[1].administrator_role = AdministratorRoleName.BASE;
        mockApiFindUsers(users);

        mockGetAdministratorRoles();

        renderWithRouter(<ManageAdministrators />);

        expect(
            await screen.findByRole("textbox", { name: "search" }),
        ).toBeInTheDocument();

        expect(screen.getByText(users[0].handle)).toBeInTheDocument();
        const user_1 = screen.getByText(users[0].handle).closest("div");
        expect(
            within(user_1).getByRole("button", {
                name: "remove administrator role",
            }),
        ).toBeInTheDocument();
        expect(
            within(user_1).getByText(
                `${AdministratorRoleName.FULL} Administrator`,
            ),
        ).toBeInTheDocument();

        const user_2 = screen.getByText(users[1].handle).closest("div");
        expect(
            within(user_2).getByRole("button", {
                name: "remove administrator role",
            }),
        ).toBeInTheDocument();
        expect(
            within(user_2).getByText(
                `${AdministratorRoleName.BASE} Administrator`,
            ),
        ).toBeInTheDocument();

        nock.cleanAll();
    });

    it("should change user role when dropdown is changed", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const user = createFakeUser({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiFindUsers([user]);

        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({
            user,
            new_role: AdministratorRoleName.BASE,
        });

        renderWithRouter(<ManageAdministrators />);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(
            await screen.findByRole("option", {
                name: `${AdministratorRoleName.BASE} Administrator`,
            }),
        );

        await waitFor(() => set_role_scope.done());
        nock.cleanAll();
    });

    it("should remove admin role when trash icon clicked", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const user = createFakeUser({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiFindUsers([user]);

        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({
            user,
            new_role: null,
        });

        renderWithRouter(<ManageAdministrators />);

        await userEvent.click(
            await screen.findByRole("button", {
                name: "remove administrator role",
            }),
        );

        set_role_scope.done();

        nock.cleanAll();
    });
});
