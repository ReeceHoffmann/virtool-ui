import { useDialogParam } from "@app/hooks";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { useUpdateOTU } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import OtuForm from "./OtuForm";

type OtuEditProps = {
    abbreviation: string;
    name: string;
    otuId: string;
};

/**
 * Displays a dialog for editing an OTU
 */
export default function OtuEdit({ abbreviation, name, otuId }: OtuEditProps) {
    const { open: openEditOTU, setOpen: setOpenEditOTU } =
        useDialogParam("openEditOTU");

    const mutation = useUpdateOTU(otuId);

    function handleSubmit({ name, abbreviation }) {
        mutation.mutate(
            { otuId, name, abbreviation },
            {
                onSuccess: () => {
                    setOpenEditOTU(false);
                },
            },
        );
    }

    function onHide() {
        setOpenEditOTU(false);
        mutation.reset();
    }

    return (
        <Dialog open={openEditOTU} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit OTU</DialogTitle>
                    <OtuForm
                        name={name}
                        abbreviation={abbreviation}
                        error={
                            mutation.isError &&
                            mutation.error.response.body.message
                        }
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
