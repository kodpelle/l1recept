import React, { useEffect, useState } from "react";
import { getRecipes, type Recipe } from "../services/recipes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getReviewsByRecipeId } from "../services/recipes";
import { StarRating } from "../components/StarRating";

export default function RecipesListPage() {
    const [items, setItems] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [ratings, setRatings] = useState<Record<number, number>>({});
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

    useEffect(() => {
        if (items.length === 0) return;

        (async () => {
            const newRatings: Record<number, number> = {};
            for (const r of items) {
                try {
                    const reviews = await getReviewsByRecipeId(r.id);
                    if (reviews.length > 0) {
                        const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
                        newRatings[r.id] = avg;
                    }
                } catch (e) {
                    console.error("Failed to fetch reviews for recipe", r.id, e);
                }
            }
            setRatings(newRatings);
        })();
    }, [items]);


    if (loading) return <div>Loading...</div>;

    const filtered = items.filter((r) =>
        (r.title + " " + (r.description ?? ""))
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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

            <input
                className="form-control mb-3"
                placeholder="Sök recept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filtered.length === 0 ? (
                <div>Inga recept matchar sökningen.</div>
            ) : (
                <div className="row g-3">
                    {filtered.map((r) => {
                        const hasImg = !!r.imageUrl && r.imageUrl.trim() !== "";
                        return (
                            <div key={r.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card h-100">
                                    {hasImg && (
                                        <img
                                            src={r.imageUrl}
                                            alt={r.title}
                                            className="card-img-top"
                                            style={{ height: 160, objectFit: "cover" }}
                                            onError={(e) =>
                                                ((e.target as HTMLImageElement).style.display = "none")
                                            }
                                        />
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{r.title}</h5>
                                        {ratings[r.id] !== undefined && (
                                            <div className="mb-2 text-warning">
                                                <StarRating value={Math.round(ratings[r.id])} />{" "}
                                                <small className="text-muted">({ratings[r.id].toFixed(1)})</small>
                                            </div>
                                        )}
                                        {r.description && (
                                            <p className="card-text text-muted">
                                                {r.description.length > 90
                                                    ? r.description.slice(0, 90) + "…"
                                                    : r.description}
                                            </p>
                                        )}
                                        <button
                                            className="btn btn-sm btn-outline-primary mt-auto"
                                            onClick={() => navigate(`/recipes/${r.id}`)}
                                        >
                                            Visa recept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

RecipesListPage.route = {
    path: "/recipes",
    index: 3,
    menulabel: "Recipes",
};
