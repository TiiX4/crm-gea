"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function TipificarModal({venta,cerrar,recargar}:any){

const [respuesta,setRespuesta] = useState("")
const [motivo,setMotivo] = useState("")
const [submotivo,setSubmotivo] = useState("")
const [observacion,setObservacion] = useState("")
const [recuperacion,setRecuperacion] = useState("")

const guardar = async ()=>{

await supabase
.from("ventas")
.update({
respuesta_bo:respuesta,
motivo:motivo,
submotivo:submotivo,
observacion:observacion,
estado:"finalizado"
})
.eq("id",venta.id)

recargar()
cerrar()

}

return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white rounded-xl shadow-xl w-[700px] p-8">

<h2 className="text-xl font-semibold mb-6">
Tipificación BO
</h2>

<p className="text-sm mb-4">
Caso: {venta.numero_caso}
</p>

<div className="grid grid-cols-2 gap-6">

<div>

<label className="text-sm text-gray-600">
Respuesta BO
</label>

<select
className="border rounded-lg w-full p-2 mt-1"
value={respuesta}
onChange={(e)=>setRespuesta(e.target.value)}
>

<option value="">Seleccionar</option>

{venta.tipo === "Descuento" && (
<>
<option>CONFORME</option>
<option>NO PROCEDE</option>
<option>NO HAY CASO</option>
<option>ATENDIDO POR CLARO</option>
</>
)}

{venta.tipo === "Bono" && (
<>
<option>CONFORME</option>
<option>NO PROCEDE</option>
<option>REMEDY</option>
</>
)}

</select>

</div>

<div>

<label className="text-sm text-gray-600">
Motivo
</label>

<select
className="border rounded-lg w-full p-2 mt-1"
value={motivo}
onChange={(e)=>setMotivo(e.target.value)}
>

<option>ERROR EN PLANTILLA</option>
<option>DESCUENTO NO AUTORIZADO</option>
<option>CLIENTE CON DESCUENTO ACTIVO</option>

</select>

</div>

<div>

<label className="text-sm text-gray-600">
SubMotivo
</label>

<select
className="border rounded-lg w-full p-2 mt-1"
value={submotivo}
onChange={(e)=>setSubmotivo(e.target.value)}
>

<option>NO CREA CASO</option>
<option>ERROR DE RUTA EN CREACIÓN</option>
<option>NO REGISTRA SN</option>

</select>

</div>

</div>

{respuesta === "NO PROCEDE" && (

<div className="mt-6">

<label className="text-sm text-gray-600">
Recuperación
</label>

<select
className="border rounded-lg w-full p-2 mt-1"
value={recuperacion}
onChange={(e)=>setRecuperacion(e.target.value)}
>

<option>RECUPERADO</option>
<option>NO RECUPERADO</option>

</select>

</div>

)}

<div className="mt-6">

<label className="text-sm text-gray-600">
Observación
</label>

<textarea
className="border rounded-lg w-full p-3 h-24 mt-1"
value={observacion}
onChange={(e)=>setObservacion(e.target.value)}
/>

</div>

<div className="flex gap-4 mt-6">

<button
onClick={cerrar}
className="bg-gray-500 text-white px-5 py-2 rounded"
>

Cancelar

</button>

<button
onClick={guardar}
className="bg-green-600 text-white px-5 py-2 rounded"
>

Guardar

</button>

</div>

</div>

</div>

)

}