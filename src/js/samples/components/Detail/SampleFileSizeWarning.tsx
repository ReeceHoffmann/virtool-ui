import { Alert, Icon } from "@base";
import { endsWith, some } from "lodash-es";
import React from "react";
import { Link, Route, useRouter } from "wouter";
import { Read } from "../../types";

type SampleFileSizeWarningProps = {
    reads: Read[];
    sampleId: string;
};

/**
 * Displays a warning if any sample files are under 10 megabytes
 */
export default function SampleFileSizeWarning({ reads, sampleId }: SampleFileSizeWarningProps) {
    const location = useRouter().base;
    const show = some(reads, file => file.size < 10000000);
    console.log({ location });

    if (show) {
        const showLink = !endsWith(location, "/files");

        const link = showLink ? (
            <Link to={`~/samples/${sampleId}/files`}>Check the file sizes</Link>
        ) : (
            "Check the file sizes"
        );

        return (
            <Alert color="orange" level>
                <Icon name="exclamation-triangle" />
                <Route path="~/samples/:sampleId/files"> test route</Route>
                <span>
                    <strong>The read files in this sample are smaller than expected. </strong>
                    <span>{link} and ensure they are correct.</span>
                </span>
            </Alert>
        );
    }

    return null;
}
