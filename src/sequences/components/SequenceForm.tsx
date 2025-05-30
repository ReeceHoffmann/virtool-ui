import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { OtuSegment, OtuSequence } from "@otus/types";
import React from "react";
import { FormProvider } from "react-hook-form";
import Accession from "./Accession";
import SequenceField from "./SequenceField";
import SequenceSegmentField from "./SequenceSegmentField";

type SequenceFormValues = {
    accession: string;
    definition: string;
    host: string;
    segment: string | null;
    sequence: string;
};

type SequenceFormProps = {
    /** The sequence. This is undefined when creating a new sequence. */
    activeSequence?: OtuSequence;

    hasSchema: boolean;
    /** Whether the form is of type edit or add */
    noun: string;

    /** A callback function to add/edit a genome sequence  */
    onSubmit: (formValues: SequenceFormValues) => void;

    /** The ID of the sequence's parent OTU. */
    otuId: string;

    /** The ID of the sequence's parent reference. */
    refId: string;

    /** A list of unreferenced segments */
    segments: OtuSegment[];
};

/**
 * A form for creating or editing a genome sequence
 */
export default function SequenceForm({
    activeSequence,
    hasSchema,
    noun,
    onSubmit,
    otuId,
    refId,
    segments,
}: SequenceFormProps) {
    const {
        accession,
        definition,
        host,
        id = "",
        segment = null,
        sequence = "",
    } = activeSequence || {};

    const methods = usePersistentForm<SequenceFormValues>({
        defaultValues: {
            segment: segment || null,
            accession: accession || "",
            definition: definition || "",
            host: host || "",
            sequence: sequence || "",
        },
        formName: `${noun}Sequence${id}`,
    });

    const {
        formState: { errors },
        handleSubmit,
        hasRestored,
        register,
        reset,
    } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <RestoredAlert
                    hasRestored={hasRestored}
                    name="sequence"
                    resetForm={reset}
                />
                <SequenceSegmentField
                    hasSchema={hasSchema}
                    otuId={otuId}
                    refId={refId}
                    segments={segments}
                />

                <Accession />

                <InputGroup>
                    <InputLabel htmlFor="host">Host</InputLabel>
                    <InputSimple id="host" {...register("host")} />
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="definition">Definition</InputLabel>
                    <InputSimple
                        id="definition"
                        {...register("definition", {
                            required: "Required Field",
                        })}
                    />
                    <InputError>{errors.definition?.message}</InputError>
                </InputGroup>

                <SequenceField />
                <SaveButton />
            </form>
        </FormProvider>
    );
}
