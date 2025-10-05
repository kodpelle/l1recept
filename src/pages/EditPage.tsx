import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { getRecipeById, type Recipe, updateRecipe } from "../services/recipes";
import { RecipeForm, type RecipeFormValues } from "../components/RecipeForm";
import { splitDescription, mergeDescription } from "../utils/recipeText";

export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const recipeId = Number(id);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [formValues, setFormValues] = useState<RecipeFormValues>({
        title: "",
        shortDesc: "",
        instructions: "",
        imageUrl: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!Number.isFinite(recipeId)) return;

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const r = await getRecipeById(recipeId);
                if (cancelled) return;

                setRecipe(r);
                const { shortDesc, instructions } = splitDescription(r.description);
                setFormValues({
                    title: r.title ?? "",
                    shortDesc,
                    instructions,
                    imageUrl: r.imageUrl ?? "",
                });
            } catch (e) {
                if (!cancelled) console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [recipeId]);

    if (!user || !id) return <NotFound />;

    if (loading) return <div className="container py-4">Laddar…</div>;
    if (!recipe) return <NotFound />;

    const isOwner = recipe.userId === user.id;
    const isAdmin = user.role?.includes("admin");
    if (!isOwner && !isAdmin) return <NotFound />;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setSubmitting(true);
            await updateRecipe(recipeId, {
                title: formValues.title.trim(),
                description: mergeDescription(formValues.shortDesc, formValues.instructions),
                imageUrl: formValues.imageUrl.trim() || undefined,
            });
            navigate(`/recipes/${recipeId}`);
        } catch (e) {
            console.error(e);
            alert("Kunde inte uppdatera receptet.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-3">Redigera recept</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <RecipeForm
                            initial={formValues}
                            values={formValues}
                            onChange={setFormValues}
                        />

                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-primary" type="submit" disabled={submitting}>
                                {submitting ? "Sparar…" : "Spara ändringar"}
                            </button>
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={() => navigate(`/recipes/${recipeId}`)}
                                disabled={submitting}
                            >
                                Avbryt
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

EditPage.route = {
    path: "/edit/:id",
    requireRole: "user",
};
