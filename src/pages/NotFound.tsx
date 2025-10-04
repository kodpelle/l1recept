export default function NotFound() {
    return (
        <div className="text-center m-5">
            <h1 className="display-1">Den här sidan finns inte. Prova hemknappen så hittar du rätt!</h1>
        </div>
    );
}

NotFound.route = {
    path: "*",
}