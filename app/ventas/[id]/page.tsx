"use client";

import { useEffect,useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams,useRouter } from "next/navigation";

export default function GestionVenta(){

const {id} = useParams();
const router = useRouter();

const [respuesta,setRespuesta] = useState("")
const [motivo,setMotivo] = useState("")
const [submotivo,setSubmotivo] = useState("")
const [observacion,setObservacion] = useState("")

const guardar = async()=>{

await supabase
.from("ventas")
.update({
respuesta_bo:respuesta,
motivo:motivo,
submotivo:submotivo,
observacion:observacion,
estado:"finalizado"
})
.eq("id",id)

router.push("/dashboard/mis-ventas")

}

return(

<div className="min-h-screen bg-gray-100 p-10">

<h1 className="text-2xl font-bold mb-6">
Tipificación BO
</h1>

<div className="bg-white p-6 rounded-xl shadow w-[600px]">

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setRespuesta(e.target.value)}
>

<option>Seleccionar</option>
<option>CONFORME</option>
<option>NO PROCEDE</option>

</select>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setMotivo(e.target.value)}
>

<option>ERROR EN PLANTILLA</option>
<option>DESCUENTO NO AUTORIZADO</option>
<option>CLIENTE CON DESCUENTO ACTIVO</option>

</select>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setSubmotivo(e.target.value)}
>

<option>NO CREA CASO</option>
<option>ERROR DE RUTA EN CREACIÓN</option>
<option>NO REGISTRA SN</option>
<option>ERROR TIPO DE SOLICITUD</option>
<option>ERROR DE OPERADOR</option>

</select>

<textarea
className="border p-2 w-full mb-4"
placeholder="Observación"
onChange={(e)=>setObservacion(e.target.value)}
/>

<div className="flex gap-3">

<button
onClick={()=>router.back()}
className="bg-gray-500 text-white px-4 py-2 rounded"
>
Regresar
</button>

<button
onClick={guardar}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Guardar
</button>

</div>

</div>

</div>

)

}