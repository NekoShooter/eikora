import chatSimuladoEnVivo from "./simulacionChat.js";
import Lectora from "./leector.js";

const btnStart = document.getElementById("start");
let iniciado = false;

const chat = new chatSimuladoEnVivo;

/*
const micro = new Microfono;
const voz = new tts;
const msn = new AdminMsn;
const timing = new Taimy;
timing.nuevo(()=>{voz.lee(msn.obtenerMensaje());},{espera:3000});


micro.ejecutarEnActivo(()=>{
    if(voz.estaLeyendo) return;
    timing.detener();
    console.log('estas hablando')});

micro.ejecutarEnSilencio(()=>{
    console.log(`la voz esta leyendo ${voz.estaLeyendo}`);
    if(!voz.estaLeyendo)
        voz.lee(msn.obtenerMensaje());});

voz.ejecutarAlterminarDeLeer(()=>{
    console.log(`micro en silencio: ${micro.estaEnSilencio}`)
    if(micro.estaEnSilencio) timing.reinicioTotal();
});

micro.ejecutarAlpedirPermiso((seDioPermiso)=>{
    if(seDioPermiso) timing.arrancar();
    micro.detectarSonido(seDioPermiso);})

btnStart.addEventListener('click',()=>{
    if(iniciado) return; iniciado = true;
    chat.funcionReseptora((usuario,mensaje)=>{
        console.log(`${usuario}:${mensaje}`);
        msn.agregarMensaje(usuario,mensaje);
        if((!msn.arrancoSalida || msn.mensajesPendientes == 1) && !voz.estaLeyendo){timing.arrancar();}
    });
    micro.accederAMicrofono();

});*/
const eikora = new Lectora;

btnStart.addEventListener('click',()=>{
    if(iniciado) return;
    eikora.arrancar();
    iniciado = true;
    chat.funcionReseptora((usuario,msn)=>{
        console.log(`${usuario}: ${msn}`);
        eikora.agregarNuevoMensaje(usuario,msn);});});
