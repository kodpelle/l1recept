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
    const [showInstrHelp, setShowInstrHelp] = useState(false);

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
            <label htmlFor="" className="form-label d-flex align-items-center ">
                Instruktioner
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={() => setShowInstrHelp(v => !v)}
                    aria-expanded={showInstrHelp}
                    aria-controls="instrHelp"
                >
                    ?
                </button>
            </label>

            {showInstrHelp && (
                <div id="instrHelp" className="alert alert-info py-2 small mb-2">
                    Skriv <strong>ett steg per rad</strong>. Ex:
                    <br />Skala löken
                    <br />Hacka den fint
                    <br />Fräs i smör
                </div>
            )}

            <textarea
                className="form-control"
                rows={4}
                placeholder="Ett steg per rad"
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
