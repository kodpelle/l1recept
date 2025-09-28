export interface Recipe {
    id: number;
    title: string;
    description?: string;
    category?: string;
    createdAt: string;
    userId: number;
    imageUrl?: string;
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

export interface RecipeIngredientCreate {
    recipeId: number;
    ingredientId: number;
    amount: string;
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

export interface Ingredient {
    id: number;
    name: string;
    category?: string;
}

export async function getIngredients(): Promise<Ingredient[]> {
    const res = await fetch('/api/ingredients');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export interface RecipeIngredient {
    id: number;
    recipeId: number;
    ingredientId: number;
    amount: string;
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