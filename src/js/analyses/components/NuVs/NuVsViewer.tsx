import { NuVsList } from "@/analyses/components/NuVs/NuVsList";
import { FormattedNuvsAnalysis } from "@/analyses/types";
import { Sample } from "@samples/types";
import React from "react";

type NuVsViewerProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuvsAnalysis;
    /** The sample that was analysed */
    sample: Sample;
};

/**
 * Detailed breakdown of the results of a NuVs analysis
 */
export default function NuVsViewer({ detail, sample }: NuVsViewerProps) {
    console.log("nuvs render");
    return (
        <div>
            {/*<NuVsToolbar analysisId={detail.id} results={detail.results} sampleName={sample.name} />*/}
            <NuVsList detail={detail} />
        </div>
    );
}
