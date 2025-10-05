import React, { useEffect, useState } from "react";

export type RecipeFormValues = {
    title: string;
    shortDesc: string;
    instructions: string;
    imageUrl: string;
};

export function RecipeForm({
    initial,
    values,
    onChange,
}: {
    initial: RecipeFormValues;
    values?: RecipeFormValues;
    onChange?: (values: RecipeFormValues) => void;
}) {
    const isControlled = values !== undefined && typeof onChange === "function";


    const [local, setLocal] = useState<RecipeFormValues>(initial);


    useEffect(() => {
        if (!isControlled) setLocal(initial);
    }, [initial, isControlled]);

    const current = isControlled ? (values as RecipeFormValues) : local;

    function update(patch: Partial<RecipeFormValues>) {
        const next = { ...current, ...patch };
        if (isControlled) {
            onChange!(next);
        } else {
            setLocal(next);
        }
    }

    return (
        <div className="d-flex flex-column gap-3">
            <input
                className="form-control"
                placeholder="Titel"
                value={current.title}
                onChange={(e) => update({ title: e.target.value })}
                required
            />

            <input
                className="form-control"
                placeholder="Kort beskrivning"
                value={current.shortDesc}
                onChange={(e) => update({ shortDesc: e.target.value })}
                required
            />

            <textarea
                className="form-control"
                placeholder="Instruktioner"
                rows={4}
                value={current.instructions}
                onChange={(e) => update({ instructions: e.target.value })}
            />

            <input
                className="form-control"
                placeholder="Bild-URL (valfri)"
                value={current.imageUrl}
                onChange={(e) => update({ imageUrl: e.target.value })}
            />

            {current.imageUrl && (
                <div className="mt-2">
                    <img
                        src={current.imageUrl}
                        alt="Förhandsgranskning"
                        style={{ maxWidth: 200, borderRadius: 8 }}
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                </div>
            )}
        </div>
    );
}
