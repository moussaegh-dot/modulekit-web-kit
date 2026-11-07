export default function PageNotFound({
  moduleKey,
  pageKey,
}) {
  return (
    <div className="p-4">

      <h2>
        Page introuvable
      </h2>

      <p>
        Impossible de résoudre la page 
        <strong> "{pageKey}"</strong>
        du module
        <strong> "{moduleKey}"</strong>.
      </p>

    </div>
  );
}