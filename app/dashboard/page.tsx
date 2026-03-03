"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!usuario || usuario.rol !== "backoffice") {
      router.push("/");
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Panel Backoffice
        </h1>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/todas")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Todas las ventas
        </button>

        <button
          onClick={() => router.push("/dashboard/mis-ventas")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Mis ventas
        </button>
      </div>

      <p className="text-gray-600">
        Selecciona una opción arriba.
      </p>

    </div>
  );
}