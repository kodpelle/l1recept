import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { getRecipeById, type Recipe } from "../services/recipes";



export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (id) {
            getRecipeById(Number(id))
                .then(setRecipe)
                .catch(console.error);
        }
    }, [id]);

    if (!user || !id) {
        return <NotFound />;
    }

    if (!recipe) {
        return <div>Laddar...</div>;
    }

    return (
        <div>
            <h1>Edit {recipe.title}</h1>
        </div>
    );

}

EditPage.route = {
    path: "/edit/:id",
    requireRole: "user"
}