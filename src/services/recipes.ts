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
