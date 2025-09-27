import { useNavigate } from "react-router-dom";
import { createRecipe, getIngredients, addRecipeIngredient, type Ingredient } from "../services/recipes";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UNITS, type Unit } from "../constants/units";



export default function RecipeNewPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [allIngs, setAllIngs] = useState<Ingredient[]>([]);
    const [selected, setSelected] = useState<
        { ingredientId: number; name: string; qty: string; unit: string }[]
    >([]);


    const [pickIngId, setPickIngId] = useState<number | "">("");
    const [pickQty, setPickQty] = useState("");
    const [pickUnit, setPickUnit] = useState<Unit>(UNITS[0]);

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
            const recipe = await createRecipe({ title, description, category, imageUrl, userId: user.id });

            for (const s of selected) {
                const amount = s.qty ? `${s.qty} ${s.unit}` : s.unit;
                await addRecipeIngredient({ recipeId: recipe.id, ingredientId: s.ingredientId, amount });
            }
            navigate(`/recipes/${recipe.id}`);
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
                <textarea className="form-control" placeholder="Beskrivning" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                <input className="form-control" placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} />
                <input className="form-control" placeholder="Bild-URL (valfri)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />

                <div className="card p-3">
                    <h5 className="mb-3">Ingredienser</h5>
                    <div className="d-flex gap-2 align-items-center">
                        <select className="form-select" value={pickIngId as any} onChange={e => setPickIngId(Number(e.target.value))}>
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


