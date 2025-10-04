import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getPendingIngredients,
    deletePendingIngredientById,
    approvePendingIngredient,
    type PendingIngredient,
} from "../services/recipes";
import { INGREDIENT_CATEGORIES } from "../constants/ingredientCategories";

export default function AdminPendingIngredientsPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<PendingIngredient[]>([]);
    const [catById, setCatById] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setErr(null);
                setLoading(true);
                const list = await getPendingIngredients();
                setItems(list);
                const init: Record<number, string> = {};
                list.forEach(p => (init[p.id] = "Övrigt"));
                setCatById(init);
            } catch (e) {
                setErr(e instanceof Error ? e.message : "Kunde inte hämta förslag.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function setCat(id: number, cat: string) {
        setCatById(prev => ({ ...prev, [id]: cat }));
    }

    async function approve(p: PendingIngredient) {
        try {
            const chosen = catById[p.id] || "Övrigt";
            await approvePendingIngredient(p, chosen);
            setItems(items.filter(i => i.id !== p.id));
        } catch (e) {
            console.error(e);
            alert("Kunde inte godkänna.");
        }
    }

    async function reject(id: number) {
        if (!confirm("Vill du avslå detta förslag?")) return;
        try {
            await deletePendingIngredientById(id);
            setItems(items.filter(i => i.id !== id));
        } catch (e) {
            console.error(e);
            alert("Kunde inte ta bort.");
        }
    }

    if (!user || user.role !== "admin") {
        return <div className="container py-4">Inte behörig.</div>;
    }

    return (
        <div className="container py-4">
            <h2>Pending Ingredients</h2>

            {loading ? (
                <div>Laddar…</div>
            ) : err ? (
                <div className="text-danger">{err}</div>
            ) : items.length === 0 ? (
                <div>Inga förslag just nu.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Namn</th>
                                <th>Skapad</th>
                                <th className="text-end">Åtgärder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                                    <td className="text-end">
                                        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
                                            <select
                                                className="form-select"
                                                value={catById[p.id] ?? "Övrigt"}
                                                onChange={(e) => setCat(p.id, e.target.value)}
                                                style={{ width: "100%", maxWidth: "200px" }}
                                            >
                                                {INGREDIENT_CATEGORIES.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-success"
                                                onClick={() => approve(p)}
                                                style={{ width: "100%" }}
                                            >
                                                Godkänn
                                            </button>

                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => reject(p.id)}
                                                style={{ width: "100%" }}
                                            >
                                                Avslå
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

AdminPendingIngredientsPage.route = {
    path: "/admin/pending/ingredients",
    index: 6,
    menuLabel: "Ingrediensförslag",
    requireRole: "admin",
};
