export function splitDescription(desc?: string) {
    const parts = (desc ?? "").split("\n\n").map(s => s.trim()).filter(Boolean);
    const [shortDesc = "", ...steps] = parts;
    const instructions = steps.join("\n");
    return { shortDesc, instructions };
}

export function mergeDescription(shortDesc: string, instructions: string) {
    const a = shortDesc.trim();
    const b = instructions.trim();
    return a + (b ? "\n" + b : "");
}