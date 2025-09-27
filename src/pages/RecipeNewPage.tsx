import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipes";
import React from "react";
import { useAuth } from "../context/AuthContext";


export default function RecipeNewPage() {
    const { user } = useAuth();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (!user) {
                alert("Du måste vara inloggad för att skapa recept.");
                return;
            }

            const newRecipe = await createRecipe({
                title,
                description,
                category,
                imageUrl,
                userId: user.id,
            });
            navigate(`/recipes/${newRecipe.id}`);
        } catch (err) {
            console.error("Failed to create recipe", err);
            alert("Något gick fel när receptet skulle sparas.");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="container py-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beskrivning" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori" />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Bild URL" />
            <button type="submit">Create Recipe</button>
        </form>
    );
}


RecipeNewPage.route = {
    path: "/recipes/new",
    index: 4
};


