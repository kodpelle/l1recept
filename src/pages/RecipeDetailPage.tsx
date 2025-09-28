import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeWithIngredients, type RecipeWithIngredients } from "../services/recipes";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const recipeId = Number(id);
    const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                setLoading(true);
                const r = await getRecipeWithIngredients(recipeId);
                setRecipe(r);
            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === "AbortError") {
                    return;
                } else if (e instanceof Error) {
                    console.error("getRecipeWithIngredients failed", e.message);
                } else {
                    console.error("getRecipeWithIngredients failed with unknown error", e);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
    }, [recipeId]);

    if (loading) return <div>Laddar...</div>;
    if (!recipe) return <div>Receptet hittades inte</div>;

    const hasImg = !!recipe.imageUrl && recipe.imageUrl.trim() !== "";

    return (
        <div>
            <Link to="/recipes">Tillbaka till recept</Link>

            <h2>{recipe.title}</h2>
            {recipe.category && <span>{recipe.category}</span>}
            {recipe.createdAt && (
                <span> · skapad: {new Date(recipe.createdAt).toLocaleString()}</span>
            )}

            {hasImg && (
                <div>
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        style={{ maxWidth: "300px" }}
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                </div>
            )}

            <p>{recipe.description}</p>

            <h3>Ingredienser</h3>
            {recipe.ingredients.length === 0 ? (
                <p>Inga ingredienser tillagda ännu.</p>
            ) : (
                <ul>
                    {recipe.ingredients.map((ri) => (
                        <li key={ri.id}>
                            <strong>{ri.ingredient.name}</strong>
                            {ri.ingredient.category ? ` (${ri.ingredient.category})` : ""} – {ri.amount}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

RecipeDetailPage.route = {
    path: "/recipes/:id",
    index: 5,
};
