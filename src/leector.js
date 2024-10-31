import Microfono from "./microfono.js";
import AdminMsn from "./adminMsn.js";
import tts from "./tts.js";
import Taimy from "taimy";

export default class Lectora {
    #micro = new Microfono;
    #chat = new AdminMsn;
    #voz = new tts;
    #timing = new Taimy;

    constructor(configuracion){
        this.configurar(configuracion);
        this.#timing.nuevo(()=>{this.#voz.lee(this.#chat.obtenerMensaje());},{espera:3000});

        this.#micro.ejecutarEnActivo(()=>{
            //if(this.#voz.estaLeyendo) return;
            this.#timing.detener();
            console.log('estas hablando')});
        
        this.#micro.ejecutarEnSilencio(()=>{
            console.log(`la voz esta leyendo ${this.#voz.estaLeyendo}`);
            if(!this.#voz.estaLeyendo)
                this.#voz.lee(this.#chat.obtenerMensaje());});

        this.#voz.ejecutarAlterminarDeLeer(()=>{
            console.log(`micro en silencio: ${this.#micro.estaEnSilencio}`)
            if(this.#micro.estaEnSilencio) this.#timing.reinicioTotal();});

        this.#micro.ejecutarAlpedirPermiso((seDioPermiso)=>{
            if(seDioPermiso) this.#timing.arrancar();
            this.#micro.detectarSonido(seDioPermiso);});}

    configurar(obj){
        this.#voz.configuracion = obj;
        this.#micro.configuracion = obj;
        this.tiempoDeRespuesta(obj?.timing);}

    dameConfiguracion(){return Object.assign({timing: this.#timing.espera},this.#chat.configuracion,this.#micro.configuracion);}

    volumen(porcentaje){this.#voz.volumen = porcentaje};
    idioma(lenguaje){this.#voz.idioma = lenguaje;}
    velocidadDeLectura(porcenteje){this.#voz.velocidadDeLectura = porcenteje;}
    umbralDeSonido(umbral){this.#micro.umbral = umbral;}
    tiempoDeReaccion(milisegundos){this.#micro.tiempoDeReaccion = milisegundos;}
    tiempoDeRespuesta(milisegundos){
        if(typeof(milisegundos) == 'number' && milisegundos > 100){
            this.#timing.espera = milisegundos;}}

    arrancar(){this.#micro.accederAMicrofono();}

    agregarNuevoMensaje(usuario,mensaje){
        if(!this.#micro.seConsedioAccesoAmicro) return;

        this.#chat.agregarMensaje(usuario,mensaje);
        if((!this.#chat.arrancoSalida || this.#chat.mensajesPendientes == 1) && !this.#voz.estaLeyendo){
            this.#timing.arrancar();}}

}
