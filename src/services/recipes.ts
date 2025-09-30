export interface Recipe {
    id: number;
    title: string;
    description?: string;
    category?: string;
    createdAt: string;
    userId: number;
    imageUrl?: string;
}

export interface Ingredient {
    id: number;
    name: string;
    category?: string;
}

export interface RecipeIngredientCreate {
    recipeId: number;
    ingredientId: number;
    amount: string;
}

export interface RecipeIngredient {
    id: number;
    recipeId: number;
    ingredientId: number;
    amount: string;
}

export interface RecipeReview {
    id: number;
    recipeId: number;
    userId: number;
    comment?: string;
    rating: number;
    createdAt: string;
}
export interface PendingIngredient {
    id: number;
    name: string;
    category?: string;
    createdAt: string;
}


export async function getRecipes(): Promise<Recipe[]> {
    const res = await fetch('/api/recipes');
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}

export async function createRecipe(
    recipe: Omit<Recipe, "id" | "createdAt">
): Promise<Recipe & { id: number }> {
    const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return { ...data, id: data.insertId ?? data.id };
}


export async function addRecipeIngredient(data: RecipeIngredientCreate) {
    const res = await fetch('/api/recipe_ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getIngredients(): Promise<Ingredient[]> {
    const res = await fetch('/api/ingredients');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getRecipeIngredients(): Promise<RecipeIngredient[]> {
    const r = await fetch("/api/recipe_ingredients");
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}


export async function getRecipeById(id: number) {
    const r = await fetch(`/api/recipes/${id}`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

export type RecipeWithIngredients = Recipe & {
    ingredients: Array<{
        id: number;
        amount: string;
        ingredient: Ingredient;
    }>;
}

export async function getRecipeWithIngredients(recipeId: number): Promise<RecipeWithIngredients> {
    const [recipe, allIngredients, allRecipeIngredients] = await Promise.all([
        getRecipeById(recipeId),
        getIngredients(),
        getRecipeIngredients()
    ]);

    const byId = new Map(allIngredients.map(i => [i.id, i]));
    const linked = allRecipeIngredients
        .filter(ri => ri.recipeId === recipeId)
        .map(ri => ({
            id: ri.id,
            amount: ri.amount,
            ingredient: byId.get(ri.ingredientId)!
        }));

    return { ...recipe, ingredients: linked };
}

export async function getReviewsByRecipeId(recipeId: number): Promise<RecipeReview[]> {
    const res = await fetch(`/api/recipe_reviews?where=recipeId=${recipeId}&orderby=-createdAt`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function createReview(input: {
    recipeId: number;
    userId: number;
    rating: number;
    comment?: string;
}): Promise<RecipeReview> {
    const res = await fetch("/api/recipe_reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deleteRecipe(id: number): Promise<void> {
    const res = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
}
export async function getRecipeIngredientsByRecipeId(recipeId: number) {
    const res = await fetch(`/api/recipe_ingredients?where=recipeId=${recipeId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Array<{ id: number }>>;
}

export async function deleteRecipeIngredientById(id: number): Promise<void> {
    const res = await fetch(`/api/recipe_ingredients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
}

export async function deleteReviewById(id: number): Promise<void> {
    const res = await fetch(`/api/recipe_reviews/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
}


export async function deleteRecipeCascade(recipeId: number): Promise<void> {

    const [links, reviews] = await Promise.all([
        getRecipeIngredientsByRecipeId(recipeId),
        getReviewsByRecipeId(recipeId),
    ]);


    await Promise.all([
        ...links.map(l => deleteRecipeIngredientById(l.id)),
        ...reviews.map(r => deleteReviewById(r.id)),
    ]);


    await deleteRecipe(recipeId);
}

export async function createPendingIngredient(input: {
    name: string;
    category?: string;
    userId?: number;
}): Promise<PendingIngredient> {
    const res = await fetch("/api/pending_ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getPendingIngredients(): Promise<PendingIngredient[]> {
    const res = await fetch('/api/pending_ingredients?orderby=-createdAt');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deletePendingIngredientById(id: number): Promise<void> {
    const res = await fetch(`/api/pending_ingredients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
}

export async function approvePendingIngredient(
    p: PendingIngredient,
    category: string
): Promise<void> {
    const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: p.name, category }),
    });
    if (!res.ok) throw new Error(await res.text());
    await deletePendingIngredientById(p.id);
}

