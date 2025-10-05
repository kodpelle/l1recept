import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    getRecipeWithIngredients,
    type RecipeWithIngredients,
    getReviewsByRecipeId,
    createReview,
    type RecipeReview,
    deleteRecipeCascade,
    type Recipe
} from "../services/recipes";
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
    const navigate = useNavigate();

    const canEdit = !!user && (user.role.includes("admin") || (recipe && user.id === recipe.userId));


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

    async function handleDelete() {
        if (!window.confirm("Är du säker på att du vill ta bort detta recept?")) return;
        try {
            await deleteRecipeCascade(recipeId);
            navigate("/recipes");
        } catch (err) {
            console.error(err);
            alert("Kunde inte ta bort receptet.");
        }
    }

    if (loading) return <div className="container my-4">Laddar...</div>;
    if (!recipe) return <div className="container my-4">Receptet hittades inte</div>;

    const hasImg = !!recipe.imageUrl && recipe.imageUrl.trim() !== "";

    const [shortDesc, ...steps] = (recipe.description ?? "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

    return (
        <div className="container my-4">

            <div className="col-lg-10 mx-auto">

                <Link to="/recipes" className="btn btn-primary mb-3 me-3">
                    ← Tillbaka till alla
                </Link>

                {canEdit && (
                    <Link to={`/edit/${recipeId}`} className="btn btn-secondary mb-3 me-3">
                        Redigera recept
                    </Link>
                )}

                {canEdit && (
                    <button className="btn btn-danger mb-3" onClick={handleDelete}>Ta bort recept</button>)}

                <div className="row align-items-start mb-4">
                    <div className="col-md-6 text-center">
                        {hasImg && (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="img-fluid rounded mb-3"
                                style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
                                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                            />
                        )}
                    </div>
                    <div className="col-md-6">
                        <h2 className="mb-1">{recipe.title}</h2>
                        {recipe.createdAt && (
                            <p className="text-muted mb-3">
                                skapad: {new Date(recipe.createdAt).toLocaleString()}
                            </p>
                        )}
                        {shortDesc && <p className="lead">{shortDesc}</p>}
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <h3>Ingredienser</h3>
                        ,
                        {recipe.ingredients.length === 0 ? (
                            <p>Inga ingredienser tillagda ännu.</p>
                        ) : (
                            <ul className="list-group">
                                {recipe.ingredients.map((ri) => (
                                    <li key={ri.id} className="list-group-item">
                                        <strong>{ri.ingredient.name}</strong> – {ri.amount}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="col-md-6">
                        {steps.length > 0 && (
                            <>
                                <h3>Instruktioner</h3>
                                <ol>
                                    {steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </>
                        )}
                    </div>
                </div>
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
                                    Snittbetyg: <StarRating value={Math.round(avg)} />{" "}
                                    <strong>{avg} / 5</strong> ({reviews.length} omdömen)
                                </span>
                            ) : (
                                <span>Inga omdömen ännu.</span>
                            )}
                        </div>

                        {reviews.length > 0 && (
                            <div className="mb-4">
                                <ul className="list-group">
                                    {reviews.map((rv) => (
                                        <li key={rv.id} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <strong>
                                                    <StarRating value={rv.rating} /> ({rv.rating} / 5)
                                                </strong>
                                                <small className="text-muted">
                                                    {new Date(rv.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                            {rv.comment && <div className="mt-1">{rv.comment}</div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="card p-3 mb-5">
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
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
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
                                        <button className="btn btn-primary" type="submit">
                                            Skicka
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

RecipeDetailPage.route = {
    path: "/recipes/:id",
    index: 5,
};
