"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function TodasVentas() {

  const router = useRouter();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas:", error);
    }

    if (data) {
      setVentas(data);
    }

    setLoading(false);

  };

  const tomarVenta = async (venta: any) => {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const { error } = await supabase
      .from("ventas")
      .update({
        estado: "en proceso",
        bo_id: usuario.id
      })
      .eq("id", venta.id);

    if (error) {
      console.error("Error tomando venta:", error);
      return;
    }

    cargarVentas();

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}

      <div className="flex justify-between mb-6 items-center">

        <h1 className="text-3xl font-bold">
          Todas las ventas
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Regresar
        </button>

      </div>

      {/* TABLA */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Caso</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Usuario</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Acción</th>

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Cargando ventas...
                </td>
              </tr>

            )}

            {!loading && ventas.length === 0 && (

              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No hay ventas registradas
                </td>
              </tr>

            )}

            {ventas.map((v) => (

              <tr
                key={v.id}
                className="border-t hover:bg-gray-50 transition"
              >

                {/* CASO */}

                <td className="p-4 font-mono">
                  {v.numero_caso}
                </td>

                {/* TIPO */}

                <td className="p-4">

                  {v.tipo === "bono"
                    ? "🎁 Bono"
                    : "💰 Descuento"}

                </td>

                {/* USUARIO AGENTE */}

                <td className="p-4">

                  {v.usuario_e || v.agente_id || "Sin usuario"}

                </td>

                {/* ESTADO */}

                <td className="p-4 capitalize">

                  {v.estado}

                </td>

                {/* ACCIÓN */}

                <td className="p-4">

                  {v.estado === "pendiente" ? (

                    <button
                      onClick={() => tomarVenta(v)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Tomar
                    </button>

                  ) : (

                    <span className="text-gray-400">
                      En proceso
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}