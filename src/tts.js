export default class tts {
    #volumen;#idioma;#voz;#velocidad; #fnTerminoDeLeer; #fnEmpezarALeer; #enejecucion = false;
    constructor(volumen = 100,idioma = undefined, rate = 100){
        this.configuracion={volumen:volumen,idioma:idioma,rate:rate};}

    set configuracion(configuracion){
        if(!configuracion) return;
        if(configuracion.volumen)this.volumen = configuracion.volumen;
        if(configuracion.rate)this.velocidadDeLectura = configuracion.rate;
        if(configuracion.idioma)this.#idioma = configuracion.idioma;}

    get configuracion(){return{volumen:this.volumen,idioma:this.#idioma,rate:this.velocidadDeLectura}}

    set volumen(volumen){
        if(typeof(volumen) != 'number' || volumen < 0) return;
        this.#volumen = volumen/100;}

    get volumen(){return this.#volumen*100;}

    set velocidadDeLectura(velocidad){
        if(typeof(velocidad) != 'number' || velocidad <= 0) return;
        this.#velocidad = velocidad/100;}

    get velocidadDeLectura(){
        return this.#velocidad*100;}
    
    set idioma(lenguaje){
        if(typeof(lenguaje) != 'string' || !['es','en','jp'].includes(lenguaje.toLowerCase())) return;
        this.#idioma = lenguaje;}

    get idioma(){return this.#idioma??'es';}

    set voz(nuevaVoz){
        this.#voz = nuevaVoz;}

    get voz(){return this.#voz??'ninguna'}

    get estaLeyendo(){return this.#enejecucion;}

    lee(texto){
        if(typeof texto != "string" || texto == "") return
        const mensajeDevoz = new SpeechSynthesisUtterance(texto);
        mensajeDevoz.volume = this.#volumen;
        if(this.#voz) {
            mensajeDevoz.voice = this.#voz;
            if(mensajeDevoz.voice==undefined) this.#voz = undefined;}

        if(!this.#voz) mensajeDevoz.lang = this.idioma;
        mensajeDevoz.rate = this.#velocidad;
        
        mensajeDevoz.onend =()=>{
        this.#enejecucion = false;
        if(this.#fnTerminoDeLeer)this.#fnTerminoDeLeer();};
    
        mensajeDevoz.onstart =()=>{
        this.#enejecucion = true;
        if(this.#fnEmpezarALeer) this.#fnEmpezarALeer();}

        window.speechSynthesis.speak(mensajeDevoz);}

    ejecutarAlEmpezarAleer(funcion){
        if(typeof(funcion) != "function") return;
        this.#fnEmpezarALeer = funcion;}

    ejecutarAlterminarDeLeer(funcion){
        if(typeof(funcion) != "function") return;
        this.#fnTerminoDeLeer = funcion;}}