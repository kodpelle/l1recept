import React, { useEffect } from "react";
import { getrecipes, type Recipe } from "../services/recipes";
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
                setItems(await getrecipes());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Recipes</h2>
            <button onClick={() => navigate("/recipes/new")}>Add Recipe</button>
            {items.length === 0 ? (
                <div>No recipes yet.</div>
            ) : (
                <ul>
                    {items.map(r => (
                        <li key={r.id}>
                            <div>{r.title}</div>
                            <div>{r.description}</div>
                            <div>{r.category}</div>
                            {r.imageUrl} && (
                            <img src={r.imageUrl} alt={r.title} style={{ maxWidth: 160, height: 'auto', borderRadius: 0 }} />
                            )
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );







}
RecipesListPage.route = {
    path: "/recipes",
    index: 3,
    menuLabel: "Recipes",
};