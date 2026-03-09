"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

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
        bo_id: usuario.id,
        hora_primera_gestion: new Date()
      })
      .eq("id", data.id);

    router.push(`/dashboard/ventas/${data.id}`);

  };

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Panel BackOffice
      </h1>

      <div className="bg-white p-6 rounded shadow w-[250px] mb-8">

        <p className="text-gray-500">
          Fichas pendientes
        </p>

        <p className="text-4xl font-bold">
          {pendientes}
        </p>

      </div>

      <div className="flex gap-4">

        <button
          onClick={recibirFicha}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Recibir ficha
        </button>

        <button
          onClick={() => router.push("/dashboard/bo/ventas")}
          className="bg-gray-800 text-white px-6 py-3 rounded"
        >
          Ver bandeja
        </button>

      </div>

    </div>

  );

}