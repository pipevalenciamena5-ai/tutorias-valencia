(function(){
"use strict";
/* ===== CONFIGURACIÓN =====
   Perfil y servicios vigentes. */

var CFG={wa:"573158876852",mail:"pipevalenciamena5@gmail.com"};
var $=function(i){return document.getElementById(i)};
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function put(id,l,f){$(id).innerHTML=l.map(f).join("")}
function fmt(n){return"$"+n.toLocaleString("es-CO")}

/* ===== DATOS EDITABLES ===== */
var DF=[["Diagnóstico y seguimiento","Se identifica dónde está la brecha, se prioriza y se revisa el avance en cada etapa."],["Acompañamiento directo","El estudiante trabaja directamente con el docente responsable de su proceso."],["Seguimiento analítico","Informes periódicos para los padres, con indicadores claros."],["Razonamiento, no memorización","Se trabaja el porqué de cada procedimiento para que se pueda aplicar a problemas nuevos."]];
var CP=[["Punto de partida","Se sigue el temario del colegio.","Diagnóstico de brechas por tema."],["Práctica","Más ejercicios del mismo tipo.","Ejercicios graduados y corrección de errores frecuentes."],["Seguimiento","Comentarios sueltos.","Informe periódico con indicadores."],["Comunicación con padres","Cuando se pregunta.","Resumen de avances acordado desde el inicio."]];
var SV=[["Refuerzo escolar integral","Nivelación de temas atrasados y consolidación de los del año en curso, de 6.º a 11.º."],["Preparación Saber (ICFES)","Práctica de preguntas tipo prueba, manejo del tiempo y análisis de errores."],["Talleres y tareas de programación y matemáticas","Acompañamiento para entender el procedimiento y la lógica; el estudiante resuelve."],["Convenios para colegios","Programas de refuerzo para cursos o grupos, a convenir con coordinación."]];
var MT=[["Diagnóstico de brechas","Una evaluación corta por temas para ubicar qué se domina y qué no."],["Plan de ruta","Temas priorizados, fechas y metas semanales acordadas con la familia."],["Ejecución guiada","Práctica en sesión con métricas simples: aciertos, tiempo y errores frecuentes."],["Evaluación de progreso","Informe periódico y ajuste del plan según los resultados."]];
var NV=[["6.º","Números enteros y racionales, fracciones, razones y proporciones, geometría básica."],["7.º","Operaciones con racionales, ecuaciones sencillas, proporcionalidad, estadística descriptiva."],["8.º","Expresiones algebraicas, ecuaciones lineales, teorema de Pitágoras, función lineal."],["9.º","Ecuaciones cuadráticas, sistemas de ecuaciones, funciones, estadística básica."],["10.º","Trigonometría, funciones y sus gráficas, geometría analítica, probabilidad."],["11.º","Funciones avanzadas, introducción al cálculo, estadística y preparación Saber."]];
var FQ=[["¿Cómo funciona la clase diagnóstica?","Es una sesión corta para ubicar las brechas por tema y ver cómo trabaja el estudiante. Con ese resultado se arma el plan de ruta."],["¿Resuelven las tareas?","No. Se explica el procedimiento y se acompaña la práctica para que el estudiante pueda resolver por sí mismo."],["¿Garantizan resultados?","No se garantizan notas ni puntajes, porque dependen también del trabajo del estudiante. Sí se garantiza un diagnóstico claro, un plan y un seguimiento medible."],["¿Cómo se paga?","Las tarifas y formas de pago se confirman por escrito antes de empezar. El simulador de esta página no cobra nada."],["¿Qué pasa si no puedo asistir a una clase?","Se reprograma avisando con anticipación. La política exacta se acuerda al agendar."],["¿Las clases son presenciales?","Hay clases presenciales en Medellín y virtuales. Puedes elegir al reservar."],["¿Cómo cuidan los datos de mi hijo?","Solo atendemos a través de un adulto responsable, pedimos únicamente lo necesario y no publicamos datos personales. Más detalles en la política de privacidad."]];
var DOC=[{n:"Andrés Felipe Valencia Mena",ar:["Matemáticas","Programación","Preparación Saber"],niv:"6.º a 11.º",mo:["Presencial","Virtual"],di:["Lun","Mar","Mié","Jue","Vie","Sáb"]}];
var PK=[["Clase diagnóstica",25000,"45 min · diagnóstico de brechas"],["Clase individual virtual",40000,"60 min"],["Clase individual presencial (Medellín)",55000,"60 min"],["Grupo pequeño (hasta 4)",30000,"90 min · valor por estudiante"],["Paquete de 4 clases",150000,"4 × 60 min · informe de seguimiento"],["Paquete Saber",280000,"8 × 60 min · simulacros"]];
var ME=[["Tarjeta","Simulación de pago con tarjeta"],["PSE","Simulación de transferencia bancaria"],["Nequi","Simulación de pago desde el celular"]];
var GD=[["algebra-9","Ecuaciones lineales y cuadráticas","9.º","8 ejercicios"],["trigonometria-10","Trigonometría básica","10.º","7 ejercicios"],["estadistica-11","Estadística y probabilidad","11.º","7 ejercicios"]];

/* ===== PINTAR CONTENIDO ===== */

put("df",DF,function(x){return'<div class="card"><h3>'+x[0]+'</h3><p>'+x[1]+'</p></div>'});
$("cp").innerHTML=CP.map(function(r){return'<tr><th scope="row">'+r[0]+'</th><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'}).join("");
put("sv",SV,function(x){return'<div class="card"><h3>'+x[0]+'</h3><p>'+x[1]+'</p></div>'});
put("mt",MT,function(x,i){return'<div class="card"><span class="n">0'+(i+1)+'</span><h3>'+x[0]+'</h3><p>'+x[1]+'</p></div>'});
put("nv",NV,function(x){return'<div class="card"><span class="n">'+x[0]+'</span><p>'+x[1]+'</p></div>'});
put("fq",FQ,function(x){return'<details><summary>'+x[0]+'</summary><p>'+x[1]+'</p></details>'});
put("gd",GD,function(x){var b="assets/guias/"+x[0];return'<div class="card"><span class="n">'+x[2]+'</span><h3>'+x[1]+'</h3><p>'+x[3]+'</p><div class="dl"><a class="btn s" href="'+b+'-sin-respuestas.pdf" download data-g="'+x[0]+'-q">Guía (PDF)</a><a class="btn s g" href="'+b+'-soluciones.pdf" download data-g="'+x[0]+'-s">Soluciones (PDF)</a></div></div>'});

[].forEach.call(document.querySelectorAll("[data-wa]"),function(a){a.href="https://wa.me/"+CFG.wa})

/* ===== DIRECTORIO DE DOCENTES ===== */
var vis=DOC;
function uniq(k){var s={};vis.forEach(function(d){(Array.isArray(d[k])?d[k]:[d[k]]).forEach(function(v){s[v]=1})});return Object.keys(s)}
function fill(id,all,list){$(id).innerHTML='<option value="">'+all+'</option>'+list.map(function(v){return'<option>'+v+'</option>'}).join("")}
fill("fa","Todas las áreas",uniq("ar"));fill("fd","Cualquier día",["Lun","Mar","Mié","Jue","Vie","Sáb"]);fill("fmo2","Cualquiera",uniq("mo"));
$("fp").innerHTML='<option value="">Sin preferencia</option>'+vis.map(function(d){return'<option value="'+d.n+'">'+d.n+'</option>'}).join("");
function dir(){
 var a=$("fa").value,d=$("fd").value,m=$("fmo2").value;
 var l=vis.filter(function(x){return(!a||x.ar.indexOf(a)>-1)&&(!d||x.di.indexOf(d)>-1)&&(!m||x.mo.indexOf(m)>-1)});
 $("dir").innerHTML=l.length?l.map(function(x,i){return'<div class="card"><h3>'+x.n+'</h3><p>'+x.ar.join(" · ")+'</p><p>Niveles: '+x.niv+'</p><p>'+x.mo.join(" y ")+' · '+x.di.join(", ")+'</p><button class="btn s g" type="button" data-d="'+esc(x.n)+'" style="margin-top:12px">Elegir docente</button></div>'}).join(""):'<p class="note">No hay docentes con esos filtros. Prueba con otra combinación o escríbenos.</p>';
 [].forEach.call($("dir").querySelectorAll("[data-d]"),function(b){b.onclick=function(){$("fp").value=b.getAttribute("data-d");$("contacto").scrollIntoView({behavior:"smooth"});$("fn").focus({preventScroll:true})}})}
["fa","fd","fmo2"].forEach(function(i){$(i).onchange=dir});dir();

/* ===== CALCULADORA ===== */
$("cb").onclick=function(){
 var g=$("cg").value,h=+$("ch").value,pr=+$("cm").value,r=$("cr"),b=this,f=$("cfb");
 var ar=[].map.call(document.querySelectorAll("[name=ar]:checked"),function(x){return x.value});
 f.hidden=true;
 if(!ar.length){r.hidden=false;r.textContent="Elige al menos un área de enfoque.";return}
 var mes=h*4;r.hidden=false;r.innerHTML="Cotización estimada por mes ("+mes+" clases): <strong>"+fmt(mes*pr)+"</strong>\n";
 b.disabled=true;var x=document.createElement("span");x.textContent="\nPreparando plan…";r.appendChild(x);
 var foco=ar.join(", ");
 var semanas=[
  "Semana 1: diagnóstico por tema y repaso de conceptos base.",
  "Semana 2: explicación guiada y ejercicios graduados de "+foco+".",
  "Semana 3: problemas aplicados y corrección de errores frecuentes.",
  "Semana 4: práctica acumulativa, revisión de avances y ajuste de objetivos."
 ];
 x.textContent="\nPlan orientativo para "+g+" · "+h+" hora(s) por semana:\n"+semanas.join("\n");
 b.disabled=false};

/* ===== RESERVA SIMBÓLICA EN 3 PASOS ===== */
var st={s:1,p:null,m:0,code:""};
function steps(){[].forEach.call($("st").children,function(d,i){d.className=(i+1<=st.s)?"on":""})}
function dl(name,txt,out){var o=$(out);try{var u=URL.createObjectURL(new Blob([txt],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000);o.textContent="Archivo descargado."}catch(e){o.textContent="No se pudo descargar."}}
function pay(){
 var e=$("py");steps();
 if(st.s===1){
  var h='<div class="grid" style="margin-top:0">';
  PK.forEach(function(p,i){h+='<div class="card"><h3>'+p[0]+'</h3><div class="price">'+fmt(p[1])+'</div><p class="note" style="margin:0 0 14px">'+p[2]+'</p><button class="btn s" type="button" data-p="'+i+'">Elegir</button></div>'});
  e.innerHTML=h+"개발"; // Se ajustó limpio abajo
  [].forEach.call(e.querySelectorAll("[data-p]"),function(b){b.onclick=function(){st.p=+b.getAttribute("data-p");st.s=2;pay();$("st").scrollIntoView({behavior:"smooth",block:"center"})}});
 }else if(st.s===2){
  var p=PK[st.p],h='<p><b>'+p[0]+'</b> · '+fmt(p[1])+'</p>';
  ME.forEach(function(m,i){h+='<label class="opt"><input type="radio" name="mp" value="'+i+'"'+(i===st.m?" checked":"")+'><span><b>'+m[0]+'</b><br><span class="note">'+m[1]+'</span></span></label>'});
  h+='<div class="chk"><input type="checkbox" id="sim"><label for="sim" style="margin:0;font-size:.9rem">Entiendo que es una simulación: no se cobra nada y no ingreso datos de pago.</label></div><p class="note" id="pe" role="alert" style="margin:10px 0 0"></p><div class="dl"><button class="btn g" type="button" id="pb">Volver</button><button class="btn" type="button" id="pn">Simular pago</button></div>';
  e.innerHTML=h;
  [].forEach.call(e.querySelectorAll("[name=mp]"),function(r){r.onchange=function(){st.m=+r.value}});
  $("pb").onclick=function(){st.s=1;pay()};
  $("pn").onclick=function(){if(!$("sim").checked){$("pe").textContent="Confirma que entiendes que es una simulación.";return}
   st.code="SIM-"+Math.random().toString(36).slice(2,8).toUpperCase();st.s=3;pay()};
 }else{
  var p=PK[st.p],txt="COMPROBANTE SIMBÓLICO (sin valor real)\nCódigo: "+st.code+"\nFecha: "+new Date().toLocaleDateString("es-CO")+"\nPaquete: "+p[0]+"\nValor de referencia: "+fmt(p[1])+"\nMétodo simulado: "+ME[st.m][0]+"\nNo se realizó ningún cobro. Para agendar, usa la sección Contacto.";
  e.innerHTML='<div class="rec" role="status">'+txt.replace(/</g,"&lt;")+'</div><div class="dl"><a class="btn" href="#contacto">Agendar mi clase</a><button class="btn g" type="button" id="rd">Descargar comprobante</button><button class="btn g" type="button" id="rr">Nueva simulación</button></div><p class="note" id="rn" aria-live="polite" style="margin-top:10px"></p>';
  $("rd").onclick=function(){dl("comprobante-simbolico.txt",txt,"rn")};
  $("rr").onclick=function(){st={s:1,p:null,m:0,code:""};pay()};
 }}
pay();

/* ===== CONTACTO ===== */
function msg(){return"Hola, soy "+$("fn").value.trim()+", adulto responsable. Quiero agendar una clase diagnóstica para un estudiante de "+$("fg").value+" ("+$("fmo").value+"). Docente preferido: "+($("fp").value||"sin preferencia")+". Correo: "+$("fe").value.trim()+(($("ft").value.trim())?". Teléfono: "+$("ft").value.trim():"")+". "+$("fm").value.trim()}
function ok(){var s=$("fs");
 if(!$("fn").value.trim()){s.textContent="Escribe el nombre del adulto responsable.";$("fn").focus();return false}
 if(!/^\S+@\S+\.\S+$/.test($("fe").value.trim())){s.textContent="Escribe un correo electrónico válido.";$("fe").focus();return false}
 if(!$("fc").checked){s.textContent="Se necesita la confirmación del adulto responsable.";$("fc").focus();return false}
 return true}
$("cf").onsubmit=function(e){e.preventDefault();if(!ok())return;window.open("https://wa.me/"+CFG.wa+"?text="+encodeURIComponent(msg()),"_blank","noopener");$("fs").textContent="Se abrió WhatsApp con tu mensaje; envíalo desde allí."};
$("bm").onclick=function(){if(!ok())return;location.href="mailto:"+CFG.mail+"?subject="+encodeURIComponent("Clase diagnóstica")+"&body="+encodeURIComponent(msg());$("fs").textContent="Se abrió tu correo con el mensaje; envíalo desde allí."};
})();