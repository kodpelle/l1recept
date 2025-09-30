import { useNavigate } from "react-router-dom";
import { createRecipe, getIngredients, addRecipeIngredient, type Ingredient, createPendingIngredient } from "../services/recipes";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UNITS, type Unit } from "../constants/units";



export default function RecipeNewPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [instructions, setInstructions] = useState("");

    const [allIngs, setAllIngs] = useState<Ingredient[]>([]);
    const [selected, setSelected] = useState<
        { ingredientId: number; name: string; qty: string; unit: string }[]
    >([]);

    const [pickIngId, setPickIngId] = useState<number | "">("");
    const [pickQty, setPickQty] = useState("");
    const [pickUnit, setPickUnit] = useState<Unit>(UNITS[0]);

    const [showSuggest, setShowSuggest] = useState(false);
    const [newIngName, setNewIngName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function submitSuggestion(e: React.FormEvent) {
        e.preventDefault();
        const name = newIngName.trim();
        if (!name) return;
        try {
            setSubmitting(true);
            await createPendingIngredient({
                name
            });
            setNewIngName("");
            setShowSuggest(false);
            alert("Tack! Förslaget har skickats in för granskning.");
        } catch (err) {
            console.error(err);
            alert("Kunde inte skicka in förslaget.");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        getIngredients().then(setAllIngs).catch(console.error);
    }, []);


    function addPicked() {
        if (!pickIngId || !pickQty.trim()) return;
        const ing = allIngs.find(i => i.id === pickIngId);
        if (!ing) return;
        if (selected.some(s => s.ingredientId === ing.id)) return;
        setSelected([...selected, { ingredientId: ing.id, name: ing.name, qty: pickQty.trim(), unit: pickUnit }]);
        setPickQty("");
        setPickIngId("");
        setPickUnit(UNITS[0]);
    }
    function removeIng(id: number) {
        setSelected(selected.filter(s => s.ingredientId !== id));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) { alert("Du måste vara inloggad."); return; }

        try {
            const combinedDesc = shortDesc.trim() + (instructions.trim() ? "\n" + instructions.trim() : "");

            const created = await createRecipe({
                title,
                description: combinedDesc,
                imageUrl,
                userId: user.id,
            });

            const recipeId = created.id;

            for (const s of selected) {
                const amount = s.qty ? `${s.qty} ${s.unit}` : s.unit;
                await addRecipeIngredient({
                    recipeId,
                    ingredientId: s.ingredientId,
                    amount
                });
            }

            navigate(`/recipes/${recipeId}`);
        } catch (err) {
            console.error(err);
            alert("Kunde inte spara receptet.");
        }
    }


    return (
        <div className="container py-4">
            <h2>Nytt recept</h2>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <input className="form-control" placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} required />
                <input
                    className="form-control"
                    placeholder="Kort beskrivning"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    required
                />

                <textarea
                    className="form-control"
                    placeholder="Instruktioner"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                />

                <input
                    className="form-control"
                    placeholder="Bild-URL (valfri)"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                />

                {imageUrl && (
                    <div className="mt-2">
                        <img
                            src={imageUrl}
                            alt="Förhandsgranskning"
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                    </div>
                )}

                <div className="card p-3">
                    <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => setShowSuggest(v => !v)}
                        >
                            Saknas din ingrediens? Lägg till förslag
                        </button>

                        {showSuggest && (
                            <div className="card card-body mt-2">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input
                                            className="form-control"
                                            placeholder="Ingrediensnamn *"
                                            value={newIngName}
                                            onChange={(e) => setNewIngName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 d-flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        type="button"
                                        onClick={submitSuggestion}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Skickar…" : "Skicka förslag"}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        type="button"
                                        onClick={() => setShowSuggest(false)}
                                        disabled={submitting}
                                    >
                                        Avbryt
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <h5 className="mb-3">Ingredienser</h5>
                    <div className="d-flex gap-2 align-items-center">
                        <select
                            className="form-select"
                            value={pickIngId}
                            onChange={(e) => {
                                const v = e.target.value;
                                setPickIngId(v === "" ? "" : Number(v));
                            }}
                        >
                            <option value="">Välj ingrediens…</option>
                            {allIngs.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                        <input className="form-control" style={{ maxWidth: 120 }} placeholder="Mängd" value={pickQty} onChange={e => setPickQty(e.target.value)} />
                        <select className="form-select" style={{ maxWidth: 120 }} value={pickUnit} onChange={e => setPickUnit(e.target.value as Unit)}>
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <button type="button" className="btn btn-outline-primary" onClick={addPicked}>Lägg till</button>
                    </div>

                    {selected.length > 0 && (
                        <ul className="list-group mt-3">
                            {selected.map(s => (
                                <li key={s.ingredientId} className="list-group-item d-flex justify-content-between">
                                    <span>{s.name} — {s.qty} {s.unit}</span>
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeIng(s.ingredientId)}>Ta bort</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" type="submit">Spara recept</button>
                    <button className="btn btn-secondary" type="button" onClick={() => navigate("/recipes")}>Avbryt</button>
                </div>
            </form>
        </div>
    );
}

RecipeNewPage.route = {
    path: "/recipes/new",
    index: 4,
    menuLabel: "New Recipe",
};


