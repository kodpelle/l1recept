import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeById, type Recipe } from "../services/recipes";


export default function RecipeDetailPage() {
    const { id } = useParams();
    const recipeId = Number(id);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setErr(null);
                setLoading(true);
                const r = await getRecipeById(recipeId);
                setRecipe(r);
            } catch (e: any) {
                setErr(e.message ?? "Kunde inte hämta recept");
            } finally {
                setLoading(false);
            }
        })();

    }, [recipeId]);
    if (loading) return <div>Laddar...</div>;
    if (err) return <div className="error">{err}</div>;
    if (!recipe) return <div>Receptet hittades inte</div>;

    const hasImg = !!recipe.imageUrl && recipe.imageUrl.trim() !== "";
    return (
        <div>
            <Link to="/recipes">Tillbaka till recept</Link>

            <h2>{recipe.title}</h2>
            {recipe.category && <span>{recipe.category}</span>}
            {recipe.createdAt && (
                <span>skapad: {new Date(recipe.createdAt).toLocaleString()}</span>
            )}

            {hasImg && (
                <div>
                    <img src={recipe.imageUrl} alt={recipe.title} style={{ maxWidth: "300px" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
            )}
            <p>{recipe.description}</p>
        </div>
    );
}

RecipeDetailPage.route = {
    path: "/recipes/:id",
    index: 5,
}