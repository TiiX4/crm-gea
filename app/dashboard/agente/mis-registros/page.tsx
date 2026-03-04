"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MisRegistros() {

  const router = useRouter();

  const [usuario, setUsuario] = useState<any>(null);
  const [registros, setRegistros] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!user || user.rol !== "agente") {
      router.push("/");
      return;
    }

    setUsuario(user);
    cargarRegistros(user.id);

  }, []);

  const cargarRegistros = async (id: string) => {

    const { data: bonos } = await supabase
      .from("bonos")
      .select("*")
      .eq("agente_id", id)
      .order("created_at", { ascending: false });

    const { data: descuentos } = await supabase
      .from("descuentos")
      .select("*")
      .eq("agente_id", id)
      .order("created_at", { ascending: false });

    const bonosFormateados =
      bonos?.map((b) => ({
        id: b.id,
        tipo: "bono",
        campania: b.campania,
        caso: b.usuario_e,
        estado: b.estado,
        created_at: b.created_at
      })) || [];

    const descuentosFormateados =
      descuentos?.map((d) => ({
        id: d.id,
        tipo: "descuento",
        campania: d.campania,
        caso: d.caso,
        estado: d.estado,
        created_at: d.created_at
      })) || [];

    const todos = [...bonosFormateados, ...descuentosFormateados];

    setRegistros(todos);

  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  const registrosFiltrados =
    filtro === "todos"
      ? registros
      : registros.filter((r) => r.estado === filtro);

  const total = registros.length;
  const bonos = registros.filter((r) => r.tipo === "bono").length;
  const descuentos = registros.filter((r) => r.tipo === "descuento").length;

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <div className="bg-white shadow px-10 py-4 flex justify-between items-center">

        <h1 className="text-xl font-semibold">
          📋 Mis Registros
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() => router.push("/dashboard/agente")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            Volver
          </button>

          <button
            onClick={cerrarSesion}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* CARDS */}

      <div className="max-w-6xl mx-auto px-4 mt-8">

        <div className="grid grid-cols-3 gap-6">

          <Card
            title="Total registros"
            value={total}
            icon="📊"
            color="text-blue-600"
          />

          <Card
            title="Bonos"
            value={bonos}
            icon="🎁"
            color="text-indigo-600"
          />

          <Card
            title="Descuentos"
            value={descuentos}
            icon="💰"
            color="text-green-600"
          />

        </div>

      </div>

      {/* FILTRO */}

      <div className="max-w-6xl mx-auto px-4 mt-8">

        <select
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>

      </div>

      {/* TABLA */}

      <div className="max-w-6xl mx-auto px-4 mt-6">

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-left">Campaña</th>
                <th className="p-4 text-left">Caso</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Fecha</th>

              </tr>

            </thead>

            <tbody>

              {registrosFiltrados.map((r) => (

                <tr
                  key={r.id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 capitalize font-medium">
                    {r.tipo === "bono" ? "🎁 Bono" : "💰 Descuento"}
                  </td>

                  <td className="p-4">
                    {r.campania}
                  </td>

                  <td className="p-4 font-mono">
                    {r.caso}
                  </td>

                  <td className="p-4">
                    <EstadoBadge estado={r.estado} />
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {registrosFiltrados.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              No tienes registros aún.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

function Card({ title, value, icon, color }: any) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">

      <div className="text-3xl">
        {icon}
      </div>

      <div>

        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <p className={`text-4xl font-bold ${color}`}>
          {value}
        </p>

      </div>

    </div>

  );

}

function EstadoBadge({ estado }: any) {

  const estilos: any = {

    pendiente: "bg-yellow-100 text-yellow-700",
    aprobado: "bg-green-100 text-green-700",
    rechazado: "bg-red-100 text-red-700"

  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${estilos[estado]}`}
    >

      {estado}

    </span>

  );

}