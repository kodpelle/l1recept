import { useNavigate } from "react-router-dom";
import { createRecipe, getIngredients, addRecipeIngredient, type Ingredient, createPendingIngredient } from "../services/recipes";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UNITS, type Unit } from "../constants/units";
import { RecipeForm, type RecipeFormValues } from "../components/RecipeForm";
import { mergeDescription } from "../utils/recipeText";



export default function RecipeNewPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    const [formValues, setFormValues] = useState<RecipeFormValues>({
        title: "", shortDesc: "", instructions: "", imageUrl: ""
    });

    async function submitSuggestion(e: React.FormEvent) {
        e.preventDefault();
        const name = newIngName.trim();
        if (!name) return;

        if (!user) {
            alert("Du måste vara inloggad för att föreslå en ingrediens.");
            return;
        }

        try {
            setSubmitting(true);
            await createPendingIngredient({
                name,
                userId: user.id,
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
            setSubmitting(true);
            const description = mergeDescription(formValues.shortDesc, formValues.instructions);
            const created = await createRecipe({
                title: formValues.title,
                description,
                imageUrl: formValues.imageUrl,
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

            navigate(`/recipes/${created.id}`);
        } catch (err) {
            console.error(err);
            alert("Kunde inte spara receptet.");
        }
    }


    return (
        <div className="container py-4">
            <h2 className="mb-3">Nytt recept</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <RecipeForm
                            initial={formValues}
                            values={formValues}
                            onChange={setFormValues}
                        />
                        <div className="card p-3 mt-4">
                            <h5 className="mb-3">Ingredienser</h5>

                            <div className="d-flex gap-2 align-items-center">
                                <select
                                    className="form-select"
                                    value={pickIngId}
                                    onChange={(e) => setPickIngId(e.target.value === "" ? "" : Number(e.target.value))}
                                >
                                    <option value="">Välj ingrediens…</option>
                                    {allIngs.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>

                                <input
                                    className="form-control"
                                    style={{ maxWidth: 120 }}
                                    placeholder="Mängd"
                                    value={pickQty}
                                    onChange={e => setPickQty(e.target.value)}
                                />

                                <select
                                    className="form-select"
                                    style={{ maxWidth: 120 }}
                                    value={pickUnit}
                                    onChange={(e) => setPickUnit(e.target.value as Unit)}
                                >
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>

                                <button type="button" className="btn btn-outline-primary" onClick={addPicked}>
                                    Lägg till
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-5">


                            {selected.length > 0 && (
                                <ul className="list-group mt-3">
                                    {selected.map(s => (
                                        <li key={s.ingredientId} className="list-group-item d-flex justify-content-between">
                                            <span>{s.name} — {s.qty} {s.unit}</span>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeIng(s.ingredientId)}>
                                                Ta bort
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-3">
                                <button type="button" className="btn btn-link p-0" onClick={() => setShowSuggest(v => !v)}>
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
                                            <button className="btn btn-primary btn-sm" type="button" onClick={submitSuggestion} disabled={submitting}>
                                                {submitting ? "Skickar…" : "Skicka förslag"}
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setShowSuggest(false)} disabled={submitting}>
                                                Avbryt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-12 d-flex gap-2 mt-3">
                                <button className="btn btn-primary" type="submit" disabled={submitting}>
                                    {submitting ? "Sparar…" : "Spara recept"}
                                </button>
                                <button className="btn btn-secondary" type="button" onClick={() => navigate("/recipes")} disabled={submitting}>
                                    Avbryt
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </form>
        </div>
    );
}

RecipeNewPage.route = {
    path: "/recipes/new",
    index: 4,
    menuLabel: "Nytt Recept",
};


