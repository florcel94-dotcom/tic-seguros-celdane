// Gráficos hechos solo con HTML + CSS (sin librerías). Reciben datos ya consultados a la base:
// datos = [{ etiqueta: "Vigente", valor: 10 }, ...]

// Barras horizontales: ideal para categorías con nombres largos (estados, tipos).
export function BarrasH({ titulo, datos }) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  return (
    <section className="panel grafico">
      <h2>{titulo}</h2>
      {datos.length === 0 ? (
        <p className="vacio">Todavía no hay datos para este gráfico.</p>
      ) : (
        <ul className="barras-h" role="list">
          {datos.map((d) => (
            <li key={d.etiqueta}>
              <span className="et">{d.etiqueta}</span>
              <span className="pista">
                <span className="barra" style={{ width: `${(d.valor / max) * 100}%` }} />
              </span>
              <span className="val">{d.valor}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Columnas verticales: ideal para series en el tiempo (meses).
export function ColumnasV({ titulo, datos }) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  return (
    <section className="panel grafico ancho">
      <h2>{titulo}</h2>
      {datos.length === 0 ? (
        <p className="vacio">Todavía no hay datos para este gráfico.</p>
      ) : (
        <ul className="columnas" role="list">
          {datos.map((d) => (
            <li key={d.etiqueta}>
              <span className="val">{d.valor}</span>
              <span className="col" style={{ height: `${(d.valor / max) * 100}%` }} />
              <span className="et">{d.etiqueta}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
