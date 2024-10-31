export default class tts {
    #volumen;#idioma;#velocidad; #fnTerminoDeLeer; #fnEmpezarALeer; #enejecucion = false;
    constructor(volumen = 1,idioma = 'es', rate = 1){
        this.configuracion={volumen:volumen,idioma:idioma,rate:rate};}

    set configuracion(configuracion){
        if(!configuracion) return;
        if(configuracion.volumen)this.#volumen = configuracion.volumen;
        if(configuracion.rate)this.#velocidad = configuracion.rate;
        if(configuracion.idioma)this.#idioma = configuracion.idioma;}

    get configuracion(){return{volumen:this.#volumen,idioma:this.#idioma,rate:this.#velocidad}}

    set volumen(volumen){
        if(typeof(volumen) != 'number' || volumen < 0) return;
        this.#volumen = volumen/100;}

    get volumen(){return this.#volumen;}

    set velocidadDeLectura(velocidad){
        if(typeof(velocidad) != 'number' || velocidad <= 0) return;
        this.#velocidad = velocidad/100;}

    get velocidadDeLectura(){return this.#velocidad;}
    
    set idioma(lenguaje){
        if(typeof(lenguaje) != 'string' || !['es','en','jp'].includes(lenguaje.toLowerCase())) return;
        this.#idioma = lenguaje;}

    get idioma(){return this.#idioma;}
    get estaLeyendo(){return this.#enejecucion;}

    lee(texto){
        if(typeof texto != "string" || texto == "") return
        const mensajeDevoz = new SpeechSynthesisUtterance(texto);
        mensajeDevoz.volume = this.#volumen;
        mensajeDevoz.lang = this.#idioma;
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