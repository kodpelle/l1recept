import React, { useEffect } from "react";
import { getRecipes, type Recipe } from "../services/recipes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RecipesListPage() {
    const [items, setItems] = React.useState<Recipe[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setItems(await getRecipes());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Recipes</h2>
                {!!user && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/recipes/new")}
                    >
                        Add Recipe
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div>No recipes yet.</div>
            ) : (
                <ul className="list-group">
                    {items.map((r) => {
                        const hasImg = !!r.imageUrl && r.imageUrl.trim() !== "";
                        return (
                            <li
                                key={r.id}
                                className="list-group-item d-flex gap-3 align-items-center"
                            >
                                {hasImg && (
                                    <img
                                        src={r.imageUrl}
                                        alt={r.title}
                                        style={{
                                            width: 120,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                )}
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">{r.title}</div>
                                    {r.description && (
                                        <div className="text-muted small">{r.description}</div>
                                    )}
                                    {r.category && (
                                        <span className="badge bg-secondary mt-1">{r.category}</span>
                                    )}
                                </div>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => navigate(`/recipes/${r.id}`)}
                                >
                                    Visa
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

RecipesListPage.route = {
    path: "/recipes",
    index: 3,
    menulabel: "Recipes",
};
