"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const router = useRouter();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("usuario") || "null");

    if (!user) {
      router.push("/");
      return;
    }

    if (user.rol === "agente") {
      router.push("/dashboard/agente");
      return;
    }

    if (user.rol === "bo") {
      router.push("/dashboard/bo/ventas");
      return;
    }

    router.push("/");

  }, []);

  return (
    <div className="flex justify-center items-center h-screen text-gray-500">
      Cargando panel...
    </div>
  );

}