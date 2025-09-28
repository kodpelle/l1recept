import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeWithIngredients, type RecipeWithIngredients, getReviewsByRecipeId, createReview, type RecipeReview } from "../services/recipes";
import { useAuth } from "../context/AuthContext";
import { StarRating } from "../components/StarRating";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const recipeId = Number(id);
    const { user } = useAuth();

    const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState<RecipeReview[]>([]);
    const [revLoading, setRevLoading] = useState(true);
    const [revErr, setRevErr] = useState<string | null>(null);

    const [myRating, setMyRating] = useState<number>(5);
    const [myComment, setMyComment] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await getRecipeWithIngredients(recipeId);
                setRecipe(r);
            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                console.error("getRecipeWithIngredients failed", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [recipeId]);


    useEffect(() => {
        (async () => {
            try {
                setRevErr(null);
                setRevLoading(true);
                const list = await getReviewsByRecipeId(recipeId);
                setReviews(list);
            } catch (e: unknown) {
                setRevErr(e instanceof Error ? e.message : "Kunde inte hämta recensioner.");
            } finally {
                setRevLoading(false);
            }
        })();
    }, [recipeId]);

    const avg =
        reviews.length > 0
            ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
            : null;

    async function submitReview(e: React.FormEvent) {
        e.preventDefault();
        if (!user) {
            alert("Du måste vara inloggad för att lämna betyg/kommentar.");
            return;
        }
        try {
            await createReview({
                recipeId,
                userId: user.id,
                rating: myRating,
                comment: myComment.trim() || undefined,
            });
            setMyRating(5);
            setMyComment("");
            const list = await getReviewsByRecipeId(recipeId);
            setReviews(list);
        } catch (err) {
            console.error(err);
            alert("Kunde inte spara din recension.");
        }
    }

    if (loading) return <div>Laddar...</div>;
    if (!recipe) return <div>Receptet hittades inte</div>;

    const hasImg = !!recipe.imageUrl && recipe.imageUrl.trim() !== "";

    return (
        <div>
            <Link to="/recipes">Tillbaka till recept</Link>

            <h2>{recipe.title}</h2>
            {recipe.createdAt && <span> · skapad: {new Date(recipe.createdAt).toLocaleString()}</span>}

            {hasImg && (
                <div className="my-2">
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        style={{ maxWidth: "300px", borderRadius: 8 }}
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                </div>
            )}

            {recipe.description && <p>{recipe.description}</p>}

            <h3>Ingredienser</h3>
            {recipe.ingredients.length === 0 ? (
                <p>Inga ingredienser tillagda ännu.</p>
            ) : (
                <ul>
                    {recipe.ingredients.map((ri) => (
                        <li key={ri.id}>
                            <strong>{ri.ingredient.name}</strong> – {ri.amount}
                        </li>
                    ))}
                </ul>
            )}

            <hr className="my-4" />
            <h3>Betyg & kommentarer</h3>

            {revLoading ? (
                <div>Laddar recensioner…</div>
            ) : revErr ? (
                <div className="text-danger">{revErr}</div>
            ) : (
                <>
                    <div className="mb-3">
                        {avg !== null ? (
                            <span>
                                Snittbetyg: <StarRating value={Math.round(avg)} />
                                <strong>{avg} / 5</strong> ({reviews.length} omdömen)

                            </span>
                        ) : (
                            <span>Inga omdömen ännu.</span>
                        )}
                    </div>

                    {reviews.length > 0 && (
                        <ul className="list-group mb-4">
                            {reviews.map((rv) => (
                                <li key={rv.id} className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <strong><StarRating value={rv.rating} /> ({rv.rating} / 5)</strong>
                                        <small className="text-muted">
                                            {new Date(rv.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                    {rv.comment && <div className="mt-1">{rv.comment}</div>}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="card p-3">
                        <h5 className="mb-3">Lämna ett omdöme</h5>
                        {!user ? (
                            <div className="text-muted">Logga in för att lämna omdöme.</div>
                        ) : (
                            <form onSubmit={submitReview} className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <label className="form-label m-0">Betyg</label>
                                    <select
                                        className="form-select"
                                        style={{ maxWidth: 100 }}
                                        value={myRating}
                                        onChange={(e) => setMyRating(Number(e.target.value))}
                                    >
                                        {[5, 4, 3, 2, 1].map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    className="form-control"
                                    placeholder="Skriv en kommentar (valfritt)"
                                    rows={3}
                                    value={myComment}
                                    onChange={(e) => setMyComment(e.target.value)}
                                />
                                <div>
                                    <button className="btn btn-primary" type="submit">Skicka</button>
                                </div>
                            </form>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

RecipeDetailPage.route = {
    path: "/recipes/:id",
    index: 5,
};