"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/", "Inicio / Dashboard"],
  ["/clientes", "Clientes"],
  ["/polizas", "Pólizas"],
  ["/siniestros", "Siniestros"],
];

export default function Nav() {
  const p = usePathname();
  return (
    <nav>
      {items.map(([href, texto]) => (
        <Link key={href} href={href} className={(href === "/" ? p === "/" : p.startsWith(href)) ? "activo" : ""}>
          {texto}
        </Link>
      ))}
    </nav>
  );
}
