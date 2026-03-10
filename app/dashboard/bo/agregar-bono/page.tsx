"use client";

import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AgregarBono() {

const router = useRouter();

const [linea,setLinea] = useState("");
const [operador,setOperador] = useState("");
const [idLlamada,setIdLlamada] = useState("");
const [usuario,setUsuario] = useState("");
const [campania,setCampania] = useState("");
const [status,setStatus] = useState("");
const [observacion,setObservacion] = useState("");

const registrarBono = async () => {

const user = JSON.parse(localStorage.getItem("usuario") || "{}");

const numeroCaso = Math.floor(Math.random()*90000000)+10000000;

try{

/* INSERT TABLA BONOS */

const { error } = await supabase
.from("bonos")
.insert([{

agente_id: user?.id || null,

campania: campania,
usuario_e: usuario,
plantilla: "BONO",
plan: "BONO",

linea: linea,
operador: operador,
id_llamada: idLlamada,
usuario: usuario,

status: status,
observacion: observacion,

numero_caso: numeroCaso,
estado: "pendiente"

}]);

if(error){

alert("Error registrando bono: "+error.message);
return;

}

/* INSERT TABLA VENTAS */

const { error:errorVentas } = await supabase
.from("ventas")
.insert([{

numero_caso: numeroCaso,
tipo: "bono",

campania: campania,
plan: "BONO",

usuario_e: usuario,

estado: "pendiente",

bo_id: user?.id || null   // 👈 guarda el BO automáticamente

}]);

if(errorVentas){

alert("Error registrando venta: "+errorVentas.message);
return;

}

alert("Bono registrado correctamente");

router.push("/dashboard/bo");

}catch(e){

alert("Error registrando bono");

}

};

return(

<div className="p-10">

<div className="bg-white shadow-xl rounded-xl p-8 max-w-5xl">

<h1 className="text-2xl font-bold mb-6">
Registrar Bono
</h1>

<div className="grid grid-cols-2 gap-6">

<div>
<label className="font-semibold">Campaña</label>

<select
className="w-full border p-3 rounded"
value={campania}
onChange={(e)=>setCampania(e.target.value)}

>

<option value="">Seleccionar campaña</option>
<option value="CONTACTADOS">CONTACTADOS</option>
<option value="INBOUND">INBOUND</option>

</select>

</div>

<div>
<label className="font-semibold">Operador</label>

<select
className="w-full border p-3 rounded"
value={operador}
onChange={(e)=>setOperador(e.target.value)}

>

<option value="">Seleccionar operador</option>
<option value="ENTEL">ENTEL</option>
<option value="MOVISTAR">MOVISTAR</option>
<option value="BITEL">BITEL</option>

</select>

</div>

<div>
<label className="font-semibold">Línea</label>

<input
className="w-full border p-3 rounded"
value={linea}
onChange={(e)=>setLinea(e.target.value)}
/>

</div>

<div>
<label className="font-semibold">ID llamada</label>

<input
className="w-full border p-3 rounded"
value={idLlamada}
onChange={(e)=>setIdLlamada(e.target.value)}
/>

</div>

<div>
<label className="font-semibold">Usuario</label>

<input
className="w-full border p-3 rounded"
value={usuario}
onChange={(e)=>setUsuario(e.target.value)}
/>

</div>

<div>
<label className="font-semibold">Status</label>

<select
className="w-full border p-3 rounded"
value={status}
onChange={(e)=>setStatus(e.target.value)}

>

<option value="">Seleccionar</option>
<option value="APROBADO">APROBADO</option>
<option value="RECHAZADO">RECHAZADO</option>

</select>

</div>

<div className="col-span-2">

<label className="font-semibold">Observación</label>

<textarea
className="w-full border p-3 rounded"
value={observacion}
onChange={(e)=>setObservacion(e.target.value)}
></textarea>

</div>

</div>

<div className="flex gap-4 mt-8">

<button
onClick={()=>router.push("/dashboard/bo")}
className="bg-gray-500 text-white px-6 py-2 rounded"

>

Volver </button>

<button
onClick={registrarBono}
className="bg-indigo-600 text-white px-6 py-2 rounded"

>

Registrar bono </button>

</div>

</div>

</div>

);

}
