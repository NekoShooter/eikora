export default class Microfono{
    #permisoConsedido = false;
    #deteccionActiva = true;
    #fnMicroActivo = undefined;
    #fnMicroSilencio = undefined;
    #fnMicroConectado = undefined;

    #estaHablando = false;
    #nombre=undefined;

    #retardo = 2000;
    #taimy;

    #analizador;
    #dataArray = [];
    #micro;
    #audioCtx;
    #umbral = 0.01;

    constructor(configuracion){
        this.detectarSonido = this.detectarSonido.bind(this);
        this.accederAMicrofono = this.accederAMicrofono.bind(this);
        this.apagar = this.apagar.bind(this);
        this.encender = this.encender.bind(this);
        this.configuracion = configuracion;}

    set configuracion(config){
        if(!config) return;
        if(config.umbral)this.#umbral = config.umbral;
        if(config.retardo)this.#retardo = config.retardo;}

    get configuracion(){return {umbral:this.#umbral,retardo:this.#retardo}}

    set umbral(umbralDeSonido){
        if(typeof(umbralDeSonido) != 'number' || umbralDeSonido < 0) return;
        this.#umbral = umbralDeSonido;}

    get umbral(){return this.#umbral;}

    set tiempoDeReaccion(milisegundos){
        if(typeof(milisegundos) != 'number' || milisegundos < 0) return;
        this.#retardo = milisegundos;}
        
    get tiempoDeReaccion(){return this.#retardo;}
    get seConsedioAccesoAmicro(){return this.#permisoConsedido;}

    get ok(){ return this.#permisoConsedido && this.#hayFunciones();}

    get estaEnSilencio(){return !this.#estaHablando;}
    get estaApagado(){return !this.#deteccionActiva;}
    get nombre(){return this.#nombre;}

    #hayFunciones(){return this.#fnMicroActivo && this.#fnMicroSilencio }

    ejecutarEnSilencio(funcion){
        if(typeof(funcion) != 'function'){ this.#fnMicroSilencio = undefined; return}
        this.#fnMicroSilencio = funcion;}

    ejecutarEnActivo(funcion){
        if(typeof(funcion) != 'function'){ this.#fnMicroActivo = undefined; return}
        this.#fnMicroActivo = funcion;}

    accederAMicrofono(){
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            this.#permisoConsedido = false;
            return}
            
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                
                this.#permisoConsedido = true;
                // Crear el contexto de audio
                this.#audioCtx = new AudioContext();
                
                // Crear un analizador para el audio
                this.#analizador = this.#audioCtx.createAnalyser();
                this.#analizador.fftSize = 256; // Configuración de precisión de análisis
                this.#dataArray = new Uint8Array(this.#analizador.fftSize);

                // Conectar el micrófono al contexto y al analizador
                this.#micro = this.#audioCtx.createMediaStreamSource(stream);
                this.#micro.connect(this.#analizador);
                this.#nombre = stream.getAudioTracks()[0].label

                if(this.#fnMicroConectado) this.#fnMicroConectado(true);
            
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    worker.postMessage(event.data); // Envía datos al Worker
                };
                mediaRecorder.start();})

            .catch(error => {
                this.#permisoConsedido = false;
                if(this.#fnMicroConectado) this.#fnMicroConectado(false);
                console.error("Error al acceder al micrófono:", error);});}

    detectarSonido(onoff = true){
        this.#deteccionActiva = !!onoff;
        this.#deteccionDeSonido();}

    apagar(){this.detectarSonido(false);}
    encender(){if(this.estaApagado) this.detectarSonido(true)}
    interruptor(){this.detectarSonido(!this.estaApagado);}

    #deteccionDeSonido(){
        if(!this.#deteccionActiva || !this.#hayFunciones){
            this.#estaHablando = false;
            clearTimeout(this.#taimy);
            this.#taimy = null;
            return;} 

        this.#analizador.getByteTimeDomainData(this.#dataArray);

        // Calcular el nivel de sonido promedio
        let suma = 0;
        this.#dataArray.forEach(valor=>{
            const amplitud = (valor - 128)/128; // Normalizar los datos
            suma += amplitud*amplitud;});

        const volumen = Math.sqrt(suma / this.#dataArray.length); // Volumen RMS

        // Comprobar si el volumen está por debajo del umbral de silencio
        this.#estaHablando = volumen > this.#umbral
        if (this.estaEnSilencio) {
            if (!this.#taimy) {
                // Si el temporizador no existe, iniciarlo
                this.#taimy = setTimeout(() => {
                    this.#fnMicroSilencio();
                }, this.#retardo);
            }
        } else {
            // Restablecer el temporizador si hay sonido
            clearTimeout(this.#taimy);
            this.#taimy = null;
            this.#fnMicroActivo(volumen);
        }

        // Volver a verificar en el siguiente cuadro de animación
        requestAnimationFrame(()=>this.#deteccionDeSonido());}

    ejecutarAlpedirPermiso(funcion){
        if(typeof(funcion) != 'function'){ this.#fnMicroConectado = undefined; return}
        this.#fnMicroConectado = funcion;
    }
}