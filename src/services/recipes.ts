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