"use client";

import { useEffect,useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MisVentas(){

const router = useRouter();

const [ventas,setVentas] = useState<any[]>([]);

useEffect(()=>{
cargarVentas()
},[])

const cargarVentas = async()=>{

const usuario = JSON.parse(localStorage.getItem("usuario")||"{}")

const {data} = await supabase
.from("ventas")
.select("*")
.eq("bo_id",usuario.id)
.eq("estado","en proceso")

if(data) setVentas(data)

}

return(

<div className="min-h-screen bg-gray-100 p-10">

<div className="flex justify-between mb-6">

<h1 className="text-3xl font-bold">
Mis ventas
</h1>

<button
onClick={()=>router.push("/dashboard")}
className="bg-gray-500 text-white px-4 py-2 rounded"
>
Regresar
</button>

</div>

<div className="bg-white rounded-xl shadow">

<table className="w-full">

<thead className="bg-gray-100">

<tr>
<th className="p-4">Caso</th>
<th className="p-4">Tipo</th>
<th className="p-4">Estado</th>
<th className="p-4">Acción</th>
</tr>

</thead>

<tbody>

{ventas.map(v=>(

<tr key={v.id} className="border-t">

<td className="p-4">{v.numero_caso}</td>

<td className="p-4">
{v.tipo === "bono" ? "🎁 Bono" : "💰 Descuento"}
</td>

<td className="p-4">{v.estado}</td>

<td className="p-4">

<button
onClick={()=>router.push(`/ventas/${v.id}`)}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Gestionar
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}