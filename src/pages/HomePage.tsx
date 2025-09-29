import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes, type Recipe } from "../services/recipes";

export default function HomePage() {
    const [items, setItems] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const all = await getRecipes();
                const latest = [...all]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6);
                setItems(latest);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="container py-4">
            <h1 className="display-3 text-center mb-4">L1Recept</h1>

            <h4 className="mb-3">Senaste recept</h4>
            {loading ? (
                <div>Laddar…</div>
            ) : items.length === 0 ? (
                <div>Inga recept ännu.</div>
            ) : (
                <div className="d-flex gap-3 overflow-auto pb-2">
                    {items.map((r) => {
                        const hasImg = !!r.imageUrl && r.imageUrl.trim() !== "";
                        return (
                            <div
                                key={r.id}
                                className="card"
                                style={{ minWidth: 200, maxWidth: 220, flex: "0 0 auto" }}
                            >
                                {hasImg && (
                                    <img
                                        src={r.imageUrl}
                                        alt={r.title}
                                        className="card-img-top"
                                        style={{ height: 120, objectFit: "cover" }}
                                        onError={(e) =>
                                            ((e.target as HTMLImageElement).style.display = "none")
                                        }
                                    />
                                )}
                                <div className="card-body">
                                    <h6 className="card-title text-truncate">{r.title}</h6>
                                    <Link
                                        to={`/recipes/${r.id}`}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Visa
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <Link to="/recipes" className="btn btn-outline-secondary mb-3 mt-3 align-self-center">
                Se alla recept →
            </Link>
        </div>
    );
}




HomePage.route = {
    path: '/',
    index: 0,
    menuLabel: 'Hem',
}