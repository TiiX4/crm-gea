"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const router = useRouter();

  const handleLogin = async (e: any) => {

    e.preventDefault();

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("usuario", usuario)
      .eq("password", password)
      .single();

    if (error || !data) {
      setMensaje("Usuario o contraseña incorrectos");
      return;
    }

    /* Guardar usuario completo */
    localStorage.setItem("usuario", JSON.stringify(data));

    /* Guardar usuario BO para registrar bonos */
    localStorage.setItem("bo_usuario", data.usuario);

    /* Redirección por rol */

    if (data.rol === "backoffice") {
      router.push("/dashboard/bo");
    } 
    else if (data.rol === "agente") {
      router.push("/dashboard/agente");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="GEA Logo"
            width={180}
            height={80}
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          GEA CRM
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition"
          >
            Ingresar
          </button>

        </form>

        {mensaje && (
          <p className="text-red-500 text-sm text-center mt-4">
            {mensaje}
          </p>
        )}

      </div>

    </div>

  );
}