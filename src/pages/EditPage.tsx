export default function EditPage() {
    return (
        <div>editpage</div>
    );
}

EditPage.route = {
    path: "/edit/:id",
    requireRole: "user"
}