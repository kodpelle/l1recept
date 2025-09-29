import { useEffect, useState } from "react";
import { getRecipes, type Recipe } from "../services/recipes";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [items, setItems] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const all = await getRecipes();
                const latest = [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
                setItems(latest);
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div>
            <h1>L1Recept</h1>
            <h2>Senaste Recepten</h2>

            {loading ? (
                <div>Laddar...</div>
            ) : items.length === 0 ? (
                <div>Inga recept funna.</div>
            ) : (
                <div>
                    {items.map((r) => {
                        const hasImg = !!r.imageUrl && r.imageUrl.trim() !== "";
                        return (
                            <div>
                                {hasImg && (
                                    <img src={r.imageUrl} alt={r.title} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} style={{ maxWidth: '200px', height: 'auto' }} />
                                )}
                                <div>
                                    <h6>{r.title}</h6>
                                    <Link to={`/recipes/${r.id}`}>Visa</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
            }
        </div>
    );
}




HomePage.route = {
    path: '/',
    index: 0,
    menuLabel: 'Hem',
}