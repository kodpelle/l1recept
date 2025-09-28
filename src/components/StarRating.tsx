type StarRatingProps = {
    value: number;
    outOf?: number;
};

export function StarRating({ value, outOf = 5 }: StarRatingProps) {
    return (
        <span>
            {Array.from({ length: outOf }, (_, i) =>
                i < value ? "★" : "☆"
            ).join("")}
        </span>
    );
}
