"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function TipificarModal({venta,cerrar}:any){

const [respuesta,setRespuesta] = useState("")
const [motivo,setMotivo] = useState("")
const [submotivo,setSubmotivo] = useState("")
const [obs,setObs] = useState("")

const guardar = async ()=>{

await supabase
.from("ventas")
.update({
respuesta_bo:respuesta,
motivo:motivo,
submotivo:submotivo,
observacion:obs,
estado:"finalizado"
})
.eq("id",venta.id)

cerrar()

}

return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white w-[900px] rounded-xl shadow-xl p-6">

<h2 className="text-xl font-bold mb-6">
Seguimiento de operación
</h2>

<div className="grid grid-cols-2 gap-6">

<div>

<label className="text-sm text-gray-500">
Respuesta BO
</label>

<select
className="border w-full p-2 rounded"
value={respuesta}
onChange={(e)=>setRespuesta(e.target.value)}
>

<option>Seleccionar</option>
<option>CONFORME</option>
<option>NO PROCEDE</option>
<option>NO HAY CASO</option>
<option>ATENDIDO POR CLARO</option>

</select>

</div>

<div>

<label className="text-sm text-gray-500">
Motivo
</label>

<select
className="border w-full p-2 rounded"
value={motivo}
onChange={(e)=>setMotivo(e.target.value)}
>

<option>ERROR EN PLANTILLA</option>
<option>DESCUENTO NO AUTORIZADO</option>
<option>CLIENTE CON DESCUENTO ACTIVO</option>

</select>

</div>

<div>

<label className="text-sm text-gray-500">
Sub Motivo
</label>

<select
className="border w-full p-2 rounded"
value={submotivo}
onChange={(e)=>setSubmotivo(e.target.value)}
>

<option>NO CREA CASO</option>
<option>ERROR DE RUTA</option>
<option>NO REGISTRA SN</option>

</select>

</div>

</div>

<div className="mt-6">

<label className="text-sm text-gray-500">
Observación
</label>

<textarea
className="border w-full p-3 rounded h-28"
value={obs}
onChange={(e)=>setObs(e.target.value)}
/>

</div>

<div className="flex justify-end gap-4 mt-6">

<button
onClick={cerrar}
className="px-4 py-2 bg-gray-500 text-white rounded"
>

Cancelar

</button>

<button
onClick={guardar}
className="px-4 py-2 bg-green-600 text-white rounded"
>

Guardar Tipificación

</button>

</div>

</div>

</div>

)

}