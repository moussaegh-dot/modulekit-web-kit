export default function ComponentNotFound({
    component,
    moduleKey,
    pageKey,
}) {

    const name =
        component || "Inconnu";

    return (

        <div className="container py-5">

            <div className="alert alert-danger">

                <h4 className="mb-3">
                    Composant introuvable
                </h4>

                <p className="mb-2">
                    Impossible de résoudre le composant
                    <strong> "{name}"</strong>.
                </p>

                <hr />

                <ul className="mb-0">

                    <li>
                        <strong>Module :</strong> {moduleKey}
                    </li>

                    <li>
                        <strong>Page :</strong> {pageKey}
                    </li>

                </ul>

            </div>

        </div>

    );

}