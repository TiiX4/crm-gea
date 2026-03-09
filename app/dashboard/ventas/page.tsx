"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Ventas() {
  const router = useRouter();
  const [numeroCaso, setNumeroCaso] = useState("");
  const [campania, setCampania] = useState("");
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

    if (!numeroCaso || !campania) {
      alert("Completa todos los campos");
      return;
    }

    await supabase.from("ventas").insert([
      {
        numero_caso: numeroCaso,
        agente_id: usuario.id,
        campania: campania,
        estado: "pendiente",
      },
    ]);

    setNumeroCaso("");
    setCampania("");
    cargarVentas(usuario.id);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  // 📊 MÉTRICAS POR ESTADO
  const totalVentas = ventas.length;
  const pendientes = ventas.filter(v => v.estado === "pendiente").length;
  const enProceso = ventas.filter(v => v.estado === "en proceso").length;
  const rechazado = ventas.filter(v => v.estado === "rechazado").length;
  const aprobado = ventas.filter(v => v.estado === "aprobado").length;

  const estadoColor = (estado: string) => {
    if (estado === "pendiente")
      return "bg-yellow-100 text-yellow-800";
    if (estado === "en proceso")
      return "bg-blue-100 text-blue-800";
    if (estado === "rechazado")
      return "bg-red-100 text-red-800";
    if (estado === "nc")
      return "bg-gray-200 text-gray-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Bienvenido, {usuario?.nombre}
          </h1>
          <p className="text-gray-500 mt-1">
            Panel de ventas
          </p>
          <button
            onClick={cerrarSesion}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-lg shadow"
          >
            Cerrar sesión
          </button>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-5 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-gray-500 text-sm">Total</h2>
            <p className="text-3xl font-bold text-blue-700">{totalVentas}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-gray-500 text-sm">Pendiente</h2>
            <p className="text-3xl font-bold text-yellow-600">{pendientes}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-gray-500 text-sm">En Proceso</h2>
            <p className="text-3xl font-bold text-blue-600">{enProceso}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-gray-500 text-sm">Rechazado</h2>
            <p className="text-3xl font-bold text-red-600">{rechazado}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-gray-500 text-sm">Aprobado</h2>
            <p className="text-3xl font-bold text-gray-700">{aprobado}</p>
          </div>

        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <form onSubmit={registrarVenta} className="grid grid-cols-3 gap-6 items-end">

            <div>
              <label className="block mb-2 font-medium text-gray-600">
                Número de caso
              </label>
              <input
                type="text"
                placeholder="Ej: 543334553"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={numeroCaso}
                onChange={(e) => setNumeroCaso(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-600">
                Campaña
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={campania}
                onChange={(e) => setCampania(e.target.value)}
              >
                <option value="">Seleccionar campaña</option>
                <option value="CONTACTADOS">CONTACTADOS</option>
                <option value="INBOUND">INBOUND</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-md h-fit"
            >
              Registrar
            </button>

          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 font-semibold">Caso</th>
                <th className="p-4 font-semibold">Campaña</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Observación</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">{venta.numero_caso}</td>
                  <td className="p-4">{venta.campania}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${estadoColor(venta.estado)}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="p-4">{venta.observacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}