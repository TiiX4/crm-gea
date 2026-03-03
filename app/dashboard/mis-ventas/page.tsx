"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MisVentas() {
  const router = useRouter();
  const [ventas, setVentas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!user || user.rol !== "backoffice") {
      router.push("/");
      return;
    }

    setUsuario(user);
    cargarVentas(user.id);
  }, []);

  const cargarVentas = async (boId: string) => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("bo_id", boId)
      .order("fecha", { ascending: false });

    if (data) setVentas(data);
  };

  const cambiarEstado = async (id: string, estado: string) => {
    await supabase
      .from("ventas")
      .update({ estado })
      .eq("id", id);

    cargarVentas(usuario.id);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">Mis Ventas</h2>

      <table className="w-full border bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Caso</th>
            <th className="p-2 border">Usuario E</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Cambiar Estado</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td className="p-2 border">{venta.numero_caso}</td>
              <td className="p-2 border">{venta.usuario_e}</td>
              <td className="p-2 border">{venta.estado}</td>
              <td className="p-2 border">

                <select
                  value={venta.estado}
                  onChange={(e) =>
                    cambiarEstado(venta.id, e.target.value)
                  }
                  className="border p-1 rounded"
                >
                  <option value="en proceso">En proceso</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                </select>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}