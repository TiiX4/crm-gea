"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function GestionVenta() {

  const { id } = useParams();
  const router = useRouter();

  const [venta, setVenta] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");

  const [respuesta, setRespuesta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [submotivo, setSubmotivo] = useState("");
  const [observacion, setObservacion] = useState("");

  // RESPUESTAS
  const respuestasBono = [
    "CONFORME",
    "NO PROCEDE",
    "REMEDY"
  ];

  const respuestasDescuento = [
    "CONFORME",
    "NO PROCEDE",
    "NO HAY CASO",
    "ATENDIDO POR CLARO"
  ];

  // MOTIVOS
  const motivos = [
    "ERROR EN PLANTILLA",
    "DESCUENTO NO AUTORIZADO",
    "TRANSACCIÓN PROGRAMADA",
    "RUTA ERRADA"
  ];

  // SUBMOTIVOS BONO
  const submotivosBono = [
    "CLIENTE CON BONO ACTIVO",
    "LÍNEA CON DEUDA / SUSPENDIDA / DESACTIVA",
    "BONO NO EXISTE EN CLARO TE RECOMIENDA",
    "PENDIENTE DE TRANSACCIONES PROGRAMADAS",
    "NO REGISTRA OFRECIMIENTO CORRECTO",
    "DESCUENTO DIFERENTE AL REGISTRADO EN PLANTILLA",
    "CAMBIO DE PLAN MÁS BONO"
  ];

  // SUBMOTIVOS DESCUENTO
  const submotivosDescuento = [
    "NO CREA CASO",
    "ERROR DE RUTA EN CREACIÓN",
    "NO REGISTRA SN",
    "ERROR TIPO SOLICITUD",
    "ERROR DE OPERADOR",
    "ERROR EN PROMOCIÓN OFRECIDA",
    "ERROR EN CANTIDAD DE MESES"
  ];

  useEffect(() => {

    cargarVenta();
    liberarFichaSiSale();

  }, []);

  // CARGAR VENTA
  const cargarVenta = async () => {

    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("id", id)
      .single();

    setVenta(data);

  };

  // BUSCAR SIGUIENTE FICHA
  const buscarNuevaFicha = async () => {

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

      setMensaje("Esperando nuevas fichas...");
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

  // GUARDAR GESTIÓN
  const guardarYSiguiente = async () => {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const inicio = new Date(venta.hora_primera_gestion);
    const fin = new Date();

    const tiempo = Math.floor((fin.getTime() - inicio.getTime()) / 1000);

    await supabase
      .from("ventas")
      .update({
        respuesta_bo: respuesta,
        motivo: motivo,
        submotivo: submotivo,
        observacion: observacion,
        estado: respuesta,
        tiempo_gestion: tiempo,
        bo_id: usuario.id
      })
      .eq("id", id);

    buscarNuevaFicha();

  };

  // LIBERAR FICHA SI BO SALE
  const liberarFichaSiSale = () => {

    const liberar = async () => {

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      await supabase
        .from("ventas")
        .update({
          estado: "pendiente",
          bo_id: null
        })
        .eq("id", id)
        .eq("estado", "gestionando")
        .eq("bo_id", usuario.id);

    };

    window.addEventListener("beforeunload", liberar);

    return () => {

      window.removeEventListener("beforeunload", liberar);

    };

  };

  if (!venta) return <div className="p-10">Cargando...</div>;

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-2xl font-bold mb-6">
        Tipificación BO
      </h1>

      {/* DATOS DE LA VENTA */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <p><b>Caso:</b> {venta.numero_caso}</p>
        <p><b>Tipo:</b> {venta.tipo}</p>
        <p><b>Campaña:</b> {venta.campania}</p>
        <p><b>Plan:</b> {venta.plan}</p>
        <p><b>Registrado por:</b> {venta.usuario_e}</p>
        <p><b>Estado:</b> {venta.estado}</p>

      </div>

      {/* FORMULARIO */}

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        {/* RESPUESTA */}

        <select
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          className="border p-3 w-full"
        >

          <option value="">Seleccionar</option>

          {venta.tipo === "bono"
            ? respuestasBono.map(r => (
              <option key={r}>{r}</option>
            ))
            : respuestasDescuento.map(r => (
              <option key={r}>{r}</option>
            ))
          }

        </select>

        {/* MOTIVO */}

        <select
          onChange={(e) => setMotivo(e.target.value)}
          className="border p-3 w-full"
        >

          <option value="">Seleccionar motivo</option>

          {motivos.map(m => (
            <option key={m}>{m}</option>
          ))}

        </select>

        {/* SUB MOTIVO */}

        <select
          onChange={(e) => setSubmotivo(e.target.value)}
          className="border p-3 w-full"
        >

          <option value="">Seleccionar submotivo</option>

          {venta.tipo === "bono"
            ? submotivosBono.map(s => (
              <option key={s}>{s}</option>
            ))
            : submotivosDescuento.map(s => (
              <option key={s}>{s}</option>
            ))
          }

        </select>

        {/* OBSERVACIÓN */}

        <textarea
          className="border p-3 w-full"
          placeholder="Observación"
          onChange={(e) => setObservacion(e.target.value)}
        />

        {mensaje && (
          <p className="text-red-500">{mensaje}</p>
        )}

        <div className="flex gap-3">

          <button
            onClick={() => router.push("/dashboard/bo")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Panel BO
          </button>

          <button
            onClick={guardarYSiguiente}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar y siguiente ficha
          </button>

        </div>

      </div>

    </div>

  );

}