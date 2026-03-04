"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MisVentas() {

  const router = useRouter();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .eq("bo_id", usuario.id)
      .order("fecha", { ascending: false });

    if (error) console.log(error);

    if (data) setVentas(data);

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Mis ventas
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Caso</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Usuario</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Tipificar</th>

            </tr>

          </thead>

          <tbody>

            {ventas.map((v) => (

              <tr key={v.id} className="border-t">

                <td className="p-4 font-mono">{v.numero_caso}</td>

                <td className="p-4">
                  {v.tipo === "bono" ? "🎁 Bono" : "💰 Descuento"}
                </td>

                <td className="p-4">
                  {v.usuario_e || "Sin usuario"}
                </td>

                <td className="p-4 capitalize">{v.estado}</td>

                <td className="p-4">

                  <button
                    onClick={() => router.push(`/dashboard/ventas/${v.id}`)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Tipificar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}