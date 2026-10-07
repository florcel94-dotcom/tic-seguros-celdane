export default function Aviso({ sp }) {
  if (sp?.error) return <p className="aviso error" role="alert">{sp.error}</p>;
  if (sp?.ok) return <p className="aviso ok" role="status">{sp.ok}</p>;
  return null;
}
