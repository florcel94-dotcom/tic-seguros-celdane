"use client";
export default function BotonEliminar({ mensaje }) {
  return (
    <button
      type="submit"
      className="link peligro"
      onClick={(e) => { if (!confirm(mensaje)) e.preventDefault(); }}
    >
      Eliminar
    </button>
  );
}
