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
            console.log('estas hablando')
        });
        
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
        this.tiempoDeRespuesta = obj?.timing;}

    dameConfiguracion(){return Object.assign({timing: this.#timing.espera},this.#chat.configuracion,this.#micro.configuracion);}

    set volumen(porcentaje){this.#voz.volumen = porcentaje};
    get volumen(){return this.#voz.volumen;}
    set velocidadDeLectura(porcenteje){this.#voz.velocidadDeLectura = porcenteje;}
    get velocidadDeLectura(){return this.#voz.velocidadDeLectura;}
    set umbralDeSonido(umbral){this.#micro.umbral = umbral;}
    get umbralDeSonido(){return this.#micro.umbral;}
    set tiempoDeReaccion(milisegundos){this.#micro.tiempoDeReaccion = milisegundos;}
    get tiempoDeReaccion(){return this.#micro.tiempoDeReaccion;}
    set tiempoDeRespuesta(milisegundos){
            if(typeof(milisegundos) == 'number' && milisegundos >= 100){
                this.#timing.espera = milisegundos;}}
    get tiempoDeRespuesta(){return this.#timing.espera;}
    get microfono(){return this.#micro;}
    get chat(){return this.#chat;}

    idioma(lenguaje){this.#voz.idioma = lenguaje;}
    cambiarVoz(nuevaVoz){this.#voz.voz = nuevaVoz;}
    arrancar(){this.#micro.accederAMicrofono();}

    agregarNuevoMensaje(usuario,mensaje){
        if(!this.#micro.seConsedioAccesoAmicro) return;

        this.#chat.agregarMensaje(usuario,mensaje);
        if((!this.#chat.arrancoSalida || this.#chat.mensajesPendientes == 1) && !this.#voz.estaLeyendo){
            this.#timing.arrancar();}}

}
