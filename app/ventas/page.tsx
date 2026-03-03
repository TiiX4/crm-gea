"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Ventas() {
  const router = useRouter();
  const [numeroCaso, setNumeroCaso] = useState("");
  const [ventas, setVentas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!user || user.rol !== "agente") {
      router.push("/");
      return;
    }

    setUsuario(user);
    cargarVentas(user.id);
  }, []);

  const cargarVentas = async (id: string) => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("agente_id", id)
      .order("fecha", { ascending: false });

    if (data) setVentas(data);
  };

  const registrarVenta = async (e: any) => {
    e.preventDefault();

    if (!numeroCaso) return;

    await supabase.from("ventas").insert([
      {
        numero_caso: numeroCaso,
        agente_id: usuario.id,
        estado: "pendiente"
      },
    ]);

    setNumeroCaso("");
    cargarVentas(usuario.id);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Registro de Venta
        </h1>
        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={registrarVenta} className="mb-6 space-y-4">
        <input
          placeholder="Número de caso"
          className="w-full p-3 border rounded"
          value={numeroCaso}
          onChange={(e) => setNumeroCaso(e.target.value)}
        />

        <button className="bg-blue-700 text-white px-6 py-3 rounded">
          Registrar Venta
        </button>
      </form>

      <table className="w-full border bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Caso</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Observación</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td className="p-2 border">{venta.numero_caso}</td>
              <td className="p-2 border">{venta.estado}</td>
              <td className="p-2 border">{venta.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}