"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Inbox, List, Gift, LogOut, FileDown } from "lucide-react";
import * as XLSX from "xlsx";

export default function PanelBO() {

  const router = useRouter();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {

    const { count } = await supabase
      .from("ventas")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente")
      .is("bo_id", null);

    setPendientes(count || 0);

  };

  const recibirFicha = async () => {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("estado", "pendiente")
      .is("bo_id", null)
      .order("fecha", { ascending: true })
      .limit(1)
      .single();

    if (!data) {
      alert("No hay fichas pendientes");
      return;
    }

    await supabase
      .from("ventas")
      .update({
        estado: "gestionando",
        bo_id: usuario.id
      })
      .eq("id", data.id);

    router.push(`/dashboard/ventas/${data.id}`);

  };

  const cerrarSesion = () => {

    localStorage.removeItem("usuario");
    router.push("/");

  };

  /* EXPORTAR EXCEL */

  const exportarExcel = async () => {

    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      alert("Error exportando Excel");
      console.log(error);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    XLSX.writeFile(workbook, "ventas.xlsx");

  };

  return (

    <div className="p-10">

      {/* HEADER */}

      <div className="flex justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Panel BackOffice
          </h1>

          <p className="text-gray-500">
            ¿Qué vas a realizar hoy?
          </p>

        </div>

        <button
          onClick={cerrarSesion}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>

      </div>

      {/* TARJETA */}

      <div className="bg-white shadow rounded-xl p-6 w-[300px] mb-10">

        <p className="text-gray-500">
          Fichas pendientes
        </p>

        <p className="text-3xl font-bold">
          {pendientes}
        </p>

      </div>

      {/* BOTONES */}

      <div className="flex gap-6 flex-wrap">

        <button
          onClick={recibirFicha}
          className="flex items-center gap-3 bg-blue-600 text-black px-8 py-4 rounded-xl shadow"
        >
          <Inbox size={20} />
          Recibir ficha
        </button>

        <button
          onClick={() => router.push("/dashboard/bo/ventas")}
          className="flex items-center gap-3 bg-gray-500 text-black px-8 py-4 rounded-xl shadow"
        >
          <List size={20} />
          Ver bandeja
        </button>

        <button
          onClick={() => router.push("/dashboard/bo/agregar-bono")}
          className="flex items-center gap-3 bg-red-500 text-black px-8 py-4 rounded-xl shadow"
        >
          <Gift size={20} />
          Agregar bono
        </button>

        <button
          onClick={exportarExcel}
          className="flex items-center gap-3 bg-green-600 text-black px-8 py-4 rounded-xl shadow"
        >
          <FileDown size={20} />
          Exportar Excel
        </button>

      </div>

    </div>

  );

}