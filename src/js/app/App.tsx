import { LoadingPlaceholder } from "@/base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthentication, useRootQuery } from "@wall/queries";
import { History } from "history";
import React, { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { Router as Wouter } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

// Lazy load components
const LazyFirstUser = React.lazy(() => import("@wall/components/FirstUser"));
const LazyLoginWall = React.lazy(() => import("@wall/components/LoginWall"));

/** The main application component that handles authentication and routing */
function ConnectedApp(): React.ReactElement {
    const { data: rootData, isPending: isRootPending } = useRootQuery();
    const { authenticated, isPending: isAuthPending } = useAuthentication();

    if (isRootPending || isAuthPending) {
        return <LoadingPlaceholder />;
    }

    if (rootData.first_user) {
        return (
            <Suspense fallback={<div />}>
                <LazyFirstUser />
            </Suspense>
        );
    }

    if (!authenticated) {
        return (
            <Suspense fallback={<div />}>
                <LazyLoginWall />
            </Suspense>
        );
    }

    return <Main />;
}

// Query client setup with default options and error handling
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount: number, error: any) => {
                if ([401, 403, 404].includes(error.response?.status)) {
                    return false;
                }
                return failureCount <= 3;
            },
            staleTime: 2000,
        },
    },
});

type AppProps = {
    // React Router history object
    history: History;
};

/** The root App component that provides theme, query client, and routing setup */
export default function App({ history }: AppProps): React.ReactElement {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Wouter hook={useBrowserLocation}>
                    <GlobalStyles />
                    <ConnectedApp />
                </Wouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
