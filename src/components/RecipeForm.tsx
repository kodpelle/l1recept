import React, { useState } from "react";

export type RecipeFormValues = {
    title: string;
    shortDesc: string;
    instructions: string;
    imageUrl: string;
};

export function RecipeForm({
    initial,
    submitting,
    onSubmit,
    onCancel,
}: {
    initial: RecipeFormValues;
    submitting?: boolean;
    onSubmit: (values: RecipeFormValues) => Promise<void> | void;
    onCancel?: () => void;
}) {
    const [title, setTitle] = useState(initial.title);
    const [shortDesc, setShortDesc] = useState(initial.shortDesc);
    const [instructions, setInstructions] = useState(initial.instructions);
    const [imageUrl, setImageUrl] = useState(initial.imageUrl);

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); onSubmit({ title, shortDesc, instructions, imageUrl }); }}
            className="d-flex flex-column gap-3"
        >
            <input className="form-control" placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} required />

            <input className="form-control" placeholder="Kort beskrivning" value={shortDesc} onChange={e => setShortDesc(e.target.value)} required />

            <textarea className="form-control" placeholder="Instruktioner" rows={4} value={instructions} onChange={e => setInstructions(e.target.value)} />

            <input className="form-control" placeholder="Bild-URL (valfri)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />

            {imageUrl && (
                <div className="mt-2">
                    <img
                        src={imageUrl}
                        alt="Förhandsgranskning"
                        style={{ maxWidth: 200, borderRadius: 8 }}
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                </div>
            )}

            <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Sparar…" : "Spara"}</button>
                {onCancel && <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={submitting}>Avbryt</button>}
            </div>
        </form>
    );
}