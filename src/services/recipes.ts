export interface Recipe {
    id: number;
    title: string;
    description?: string;
    category?: string;
    createdAt: string;
    userId: number;
    imageUrl?: string;
}

export async function getrecipes(): Promise<Recipe[]> {
    const res = await fetch('/api/recipes');
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}

export async function createRecipe(recipe: Omit<Recipe, "id" | "createdAt">): Promise<Recipe> {
    const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
    });
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    return res.json();

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
