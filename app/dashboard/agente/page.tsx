"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";

export default function AgenteInicio() {

  const router = useRouter();

  const [tipo, setTipo] = useState<"bono" | "descuento" | null>(null);
  const [usuarioLogeado, setUsuarioLogeado] = useState<any>(null);

  const [campania, setCampania] = useState("");
  const [usuarioE, setUsuarioE] = useState("");
  const [callId, setCallId] = useState("");
  const [numeroCaso, setNumeroCaso] = useState(""); // NUEVO
  const [plantilla, setPlantilla] = useState("");

  const [caso, setCaso] = useState("");
  const [callIdDescuento, setCallIdDescuento] = useState("");

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!user || user.rol !== "agente") {
      router.push("/");
      return;
    }

    setUsuarioLogeado(user);

  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  /* REGISTRAR BONO */

  const registrarBono = async () => {

    if (!campania || !usuarioE || !callId || !numeroCaso || !plantilla) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("bonos")
      .insert([
        {
          agente_id: usuarioLogeado.id,
          campania: campania,
          usuario_e: usuarioE,
          call_id: callId,
          numero_caso: numeroCaso, // NUEVO
          plantilla: plantilla,
          estado: "pendiente"
        }
      ]);

    if (error) {
      console.log(error);
      alert("Error al registrar bono");
      return;
    }

    limpiarCampos();
    alert("Bono registrado correctamente");

  };

  /* REGISTRAR DESCUENTO */

  const registrarDescuento = async () => {

    if (!caso || !callIdDescuento || !campania) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("descuentos")
      .insert([
        {
          agente_id: usuarioLogeado.id,
          campania: campania,
          caso: caso,
          callid: callIdDescuento,
          estado: "pendiente"
        }
      ]);

    if (error) {
      console.log(error);
      alert("Error al registrar descuento");
      return;
    }

    limpiarCampos();
    alert("Descuento registrado correctamente");

  };

  const limpiarCampos = () => {

    setCampania("");
    setUsuarioE("");
    setCallId("");
    setNumeroCaso(""); // NUEVO
    setPlantilla("");
    setCaso("");
    setCallIdDescuento("");

  };

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <div className="bg-white shadow-md px-10 py-4 flex justify-between items-center">

        <div className="flex items-center gap-4">

          <div className="bg-white p-2 rounded-lg">
            <Image src="/logo.png" alt="Logo" width={120} height={50} />
          </div>

          <span className="text-gray-800 font-semibold text-lg">
            Panel de Agente
          </span>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.push("/dashboard/agente/mis-registros")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow"
          >
            📋 Mis registros
          </button>

          <button
            onClick={cerrarSesion}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* CONTENIDO */}

      <div className="max-w-5xl mx-auto mt-16 bg-white rounded-3xl shadow-xl p-12">

        {!tipo && (

          <>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
              ¿Qué harás hoy?
            </h1>

            <p className="text-center text-gray-500 mb-10">
              Selecciona el tipo de gestión que deseas realizar
            </p>

            <div className="grid grid-cols-2 gap-10">

              <button
                onClick={() => setTipo("bono")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 rounded-2xl shadow-xl hover:scale-105"
              >
                <div className="text-4xl mb-3">🎁</div>
                <div className="text-2xl font-semibold">BONO</div>
                <div className="text-sm opacity-80 mt-2">
                  Registro completo de bono
                </div>
              </button>

              <button
                onClick={() => setTipo("descuento")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16 rounded-2xl shadow-xl hover:scale-105"
              >
                <div className="text-4xl mb-3">💲</div>
                <div className="text-2xl font-semibold">DESCUENTO</div>
                <div className="text-sm opacity-80 mt-2">
                  Gestión rápida de descuento
                </div>
              </button>

            </div>
          </>

        )}

        {/* BONO */}

        {tipo === "bono" && (

          <div className="space-y-6">

            <h2 className="text-3xl font-bold text-gray-800">
              Registro de Bono
            </h2>

            <select
              className="w-full border p-4 rounded-xl"
              value={campania}
              onChange={(e) => setCampania(e.target.value)}
            >
              <option value="">Seleccionar campaña</option>
              <option value="CONTACTADOS">CONTACTADOS</option>
              <option value="INBOUND">INBOUND</option>
            </select>

            <input
              placeholder="Usuario"
              className="w-full border p-4 rounded-xl"
              value={usuarioE}
              onChange={(e) => setUsuarioE(e.target.value)}
            />

            <input
              placeholder="Call ID"
              className="w-full border p-4 rounded-xl"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
            />

            <input
              placeholder="Número de Caso"
              className="w-full border p-4 rounded-xl"
              value={numeroCaso}
              onChange={(e) => setNumeroCaso(e.target.value)}
            />

            <textarea
              placeholder="Plantilla"
              className="w-full border p-4 rounded-xl h-40"
              value={plantilla}
              onChange={(e) => setPlantilla(e.target.value)}
            />

            <div className="flex gap-4">

              <button
                onClick={() => setTipo(null)}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl"
              >
                Volver
              </button>

              <button
                onClick={registrarBono}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
              >
                Registrar Bono
              </button>

            </div>

          </div>

        )}

        {/* DESCUENTO */}

        {tipo === "descuento" && (

          <div className="space-y-6">

            <h2 className="text-3xl font-bold text-gray-800">
              Registro de Descuento
            </h2>

            <input
              placeholder="Caso"
              className="w-full border p-4 rounded-xl"
              value={caso}
              onChange={(e) => setCaso(e.target.value)}
            />

            <input
              placeholder="Call ID"
              className="w-full border p-4 rounded-xl"
              value={callIdDescuento}
              onChange={(e) => setCallIdDescuento(e.target.value)}
            />

            <select
              className="w-full border p-4 rounded-xl"
              value={campania}
              onChange={(e) => setCampania(e.target.value)}
            >
              <option value="">Seleccionar campaña</option>
              <option value="CONTACTADOS">CONTACTADOS</option>
              <option value="INBOUND">INBOUND</option>
            </select>

            <div className="flex gap-4">

              <button
                onClick={() => setTipo(null)}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl"
              >
                Volver
              </button>

              <button
                onClick={registrarDescuento}
                className="bg-green-600 text-white px-8 py-3 rounded-xl"
              >
                Registrar Descuento
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}