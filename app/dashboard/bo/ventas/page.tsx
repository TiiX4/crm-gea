"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function BandejaBO() {

  const router = useRouter();

  const [ventas, setVentas] = useState<any[]>([]);

  const cargarVentas = async () => {

    const { data } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    setVentas(data || []);

  };

  useEffect(() => {

    cargarVentas();

    const canal = supabase
      .channel("ventas-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ventas"
        },
        () => {
          cargarVentas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };

  }, []);

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Bandeja BO
      </h1>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-3">Caso</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Campaña</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Usuario</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Gestionar</th>

          </tr>

        </thead>

        <tbody>

          {ventas.map((venta) => (

            <tr key={venta.id} className="border-t">

              <td className="p-3">{venta.numero_caso}</td>

              <td className="p-3">{venta.tipo}</td>

              <td className="p-3">{venta.campania}</td>

              <td className="p-3">{venta.plan}</td>

              <td className="p-3">{venta.usuario_e}</td>

              <td className="p-3">{venta.estado}</td>

              <td className="p-3">

                <button
                  onClick={() => router.push(`/dashboard/ventas/${venta.id}`)}
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

  );

}