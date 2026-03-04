"use client";

import { useRouter } from "next/navigation";

export default function Dashboard(){

const router = useRouter();

return(

<div className="min-h-screen bg-gray-100 p-10">

<div className="flex justify-between items-center mb-10">

<h1 className="text-3xl font-bold text-blue-700">
Panel BackOffice
</h1>

<button
onClick={()=>{
localStorage.removeItem("usuario")
router.push("/")
}}
className="bg-red-500 text-white px-4 py-2 rounded"
>
Cerrar sesión
</button>

</div>

<div className="flex gap-4">

<button
onClick={()=>router.push("/dashboard/todas")}
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Todas las ventas
</button>

<button
onClick={()=>router.push("/dashboard/mis-ventas")}
className="bg-green-600 text-white px-6 py-3 rounded-lg"
>
Mis ventas
</button>

</div>

</div>

)

}