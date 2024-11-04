import Lectora from "./leector";
import Taimy from "taimy";

const temaOscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const svgEnlace = `<svg width="70%" height="70%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="svgEnlace" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const svgEmision = (click = false)=>{
    const color = click ? '#f44336' : temaOscuro ? '#000000' : '#ffffff';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80%" height="80%"><circle cx="24" cy="24" r="6" fill="${color}"/><path fill="${color}" d="M17.09,16.789L14.321,13.9C11.663,16.448,10,20.027,10,24s1.663,7.552,4.321,10.1l2.769-2.889 C15.19,29.389,14,26.833,14,24C14,21.167,15.19,18.61,17.09,16.789z"/><path fill="${color}" d="M33.679,13.9l-2.769,2.889C32.81,18.611,34,21.167,34,24c0,2.833-1.19,5.389-3.09,7.211l2.769,2.889 C36.337,31.552,38,27.973,38,24S36.337,16.448,33.679,13.9z"/><g><path fill="${color}" d="M11.561,11.021l-2.779-2.9C4.605,12.125,2,17.757,2,24s2.605,11.875,6.782,15.879l2.779-2.9 C8.142,33.701,6,29.1,6,24S8.142,14.299,11.561,11.021z"/><path fill="${color}" d="M39.218,8.121l-2.779,2.9C39.858,14.299,42,18.9,42,24s-2.142,9.701-5.561,12.979l2.779,2.9 C43.395,35.875,46,30.243,46,24S43.395,12.125,39.218,8.121z"/></g></svg>`;}

const lector = new Lectora;

//#region Configurador

export class Configurador {
    #lector = lector;
    #imgMicro = undefined;

    constructor(){
        this.#enlazador('volumeControl','volumeInt','volumen');
        this.#enlazador('VelocidadDeLecturaControl','VelocidadDeLecturaInt','velocidadDeLectura',200,1);
        this.#ingresador('tiempoRespuesta','tiempoDeRespuesta',100);
        this.#ingresador('tiempoReaccion','tiempoDeReaccion');
        this.#ingresador('umbral','umbralDeSonido',0.01);
        this.#selectorIdiomas('idiomas');
        this.#imgMicro = document.getElementById('micro-svg');}

    #enlazador(range,number,valuador,max=100,min = 0){
        const controlador = document.getElementById(range);
        const int = document.getElementById(number);

        if(!controlador|| !int) return;
        
        controlador.value = int.value=this.#lector[valuador];        
        controlador.addEventListener('input',()=>{
            if(controlador.value == int.value && int.value == this.#lector[valuador])
                return;
            int.value = controlador.value;});

        int.addEventListener('input',()=>{
            if(int.value > max) int.value = max;
            else if(int.value < min || !int.value) int.value = min;

            if(controlador.value == int.value && int.value == this.#lector[valuador])
                return;
            this.#lector[valuador] = controlador.value = int.value;});}

    #ingresador(id,valuador,min=0,max){
        const controlador = document.getElementById(id);
        if(!controlador) return;
        controlador.value = this.#lector[valuador];
        controlador.addEventListener('input',()=>{
            if(max != undefined && controlador.value > max) 
                controlador.value = max;
            else if(controlador.value < min || !controlador.value) 
                controlador.value = min;

            if(controlador.value != this.#lector[valuador])
                this.#lector[valuador] = controlador.value;});}

    #selectorIdiomas(id){
        const idiomas = document.getElementById(id);
        if(!idiomas) return;

        function crearOpciones(nombre,valor){
            const opcion = document.createElement('option');
            opcion.value = valor;
            opcion.text = nombre;
            idiomas.appendChild(opcion);}

        crearOpciones('Predeterminado','es');
        let voces = window.speechSynthesis.getVoices();

        function cargarVoces() {
            voces = window.speechSynthesis.getVoices();
            if (voces.length) {
                voces.forEach((interprete,idx)=>{crearOpciones(interprete.name,idx);})}}

        cargarVoces();        
        window.speechSynthesis.onvoiceschanged = cargarVoces;

        idiomas.addEventListener("change", e=> {
            if(e.target.value == 'es'){
                this.#lector.cambiarVoz(undefined);
                this.#lector.idioma(e.target.value);}
            else
                this.#lector.cambiarVoz(voces[e.target.value]);});}

    accederAmicro(){
        const btnAccesoMicro = document.getElementById('btnMicro');

        if(!btnAccesoMicro) return;
        let confirmado = false;

        const cargaMicro = new Taimy(()=>{
            confirmado = this.#lector.microfono.seConsedioAccesoAmicro;
            if(confirmado){
                const span = document.getElementById('spanTituloMicro');
                const txtbtn = document.getElementById('spanMicro');
                if(span)span.innerText = `${this.#lector.microfono.nombre} conectado`;
                if(txtbtn) txtbtn.style.display='none';
                if(this.#imgMicro) this.#imgMicro.style.display='';
                cargaMicro.detener();}
        },{intervalo:1000});

        btnAccesoMicro.addEventListener('click',()=>{
            if(!confirmado && !cargaMicro.estaActivo){
                //this.#lector.microfono.apagar();
                this.#lector.arrancar();
                cargaMicro.arrancar();}
            else if(confirmado && !cargaMicro.estaActivo && this.#lector.chat.arrancoSalida)
                    this.interruptorMicro();});}

    interruptorMicro(onoff){
        if(!this.#imgMicro) return false;
        let estado = this.#lector.microfono.estaApagado;
        if(onoff !=undefined && !estado == !!onoff) return onoff;
        this.#lector.microfono.detectarSonido(onoff !=undefined?!!onoff:estado);
        estado = !estado;
        const apagador = ['microApagado','microEncendido'];
        this.#imgMicro.firstElementChild.classList.add(apagador[Math.abs(+estado)]);
        this.#imgMicro.firstElementChild.classList.remove(apagador[Math.abs(+estado - 1)]);
        return estado;}

    get lector(){return this.#lector;}}

//#region api chat

export function postApiChat(clave,url,fnrespueta = (r)=>{console.info(r)}){
    const api = {
        'on': '/api/chat/estado',
        'off':'/api/chat/estado',
        'nuevo':'/api/chat',
        'mensaje':'/api/chat/msn'}[clave];
    if(!api) return;

    const post = 'mensaje' == clave ? undefined : {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado:clave, url:url })}

    fetch(api,post)
        .then(respuesta=>respuesta.json())
        .then(fnrespueta)
        .catch(error=>{console.error(`error en la peticion [${clave}]`)})}

//#region UrlChats

export class UrlChats{
    #btnAgregarUrl = document.getElementById("btnAgregarUrl");
    #contenedorAgregar = document.getElementById("conNuevaUrl");
    #cuerpo = document.getElementById('divUrlChats');
    #liUrl = [];
    #bucle = new Taimy;

    constructor(){
        if(this.#btnAgregarUrl && this.#contenedorAgregar){

            this.#btnAgregarUrl.addEventListener('click',()=>{
                if(!this.#cuerpo || (this.#liUrl.length && !this.#liUrl[this.#liUrl.length-1].valido))return; 
                const nuevaUrl = this.#crearContenedor();
                this.#cuerpo.appendChild(nuevaUrl.label);                
                this.#liUrl.push(nuevaUrl);});
            
            this.#bucle.nuevo(()=>{
                postApiChat('mensaje','',(repuesta)=>{
                    if(repuesta == '[]') return;
                    const data = JSON.parse(repuesta);
                    
                    data.forEach(paquete=>{
                        lector.agregarNuevoMensaje(paquete.usuario,paquete.msn);
                    });
                
                })
            },{intervalo:3000});
            }}

    #crearContenedor(){
        const elementos = {
            label: document.createElement('label'),
            divImg: document.createElement('div'),
            input: document.createElement('input'),
            divBtn: document.createElement('div'),
            btnEmit: document.createElement('button'),
            enEmision: false,
            url:undefined,
            ok:false,
            valido: false}

        elementos.label.appendChild(elementos.divImg);
        elementos.label.appendChild(elementos.input);
        elementos.label.appendChild(elementos.divBtn);
        elementos.divBtn.appendChild(elementos.btnEmit);

        elementos.divImg.innerHTML = svgEnlace;
        elementos.input.type = 'url';
        elementos.input.placeholder = 'url del directo';
        elementos.btnEmit.innerHTML = svgEmision(false);
        const web = ['youtube','twitch'];

        function restaurar(){
            elementos.ok = false
            elementos.url = undefined;
            elementos.divImg.innerHTML = svgEnlace;}

        elementos.input.addEventListener('input',(e)=>{
            if (elementos.input.checkValidity()) {
                let i = 0;
                for(const u of this.#liUrl){ 
                    if(u.url == e.target.value) {
                        i = web.length;
                        elementos.valido = false;
                        break;}}

                for(; i < web.length; i++){
                    if(e.target.value.includes(web[i])){
                        const img = new Image;
                        img.src = `/static/./recursos/${web[i]}.png/`;
                        elementos.divImg.innerHTML = '';
                        elementos.divImg.appendChild(img);
                        elementos.valido = true;
                        elementos.url = e.target.value;
                        break;}
                    elementos.valido = false;}}

            else elementos.valido = false;
            
            if(!elementos.valido){ restaurar();}});

        elementos.btnEmit.addEventListener('click',()=>{
            if(!elementos.valido) return;
            if(!elementos.ok)
                postApiChat('nuevo',elementos.url,esValido=>{
                    elementos.ok = elementos.valido = esValido;
                    if (!elementos.valido) restaurar();
                    else{
                        elementos.enEmision = true
                        this.#bucle.arrancar()
                        postApiChat('on',elementos.url);}});
            else{
                if(elementos.enEmision) {
                    postApiChat('off',elementos.url,data=>{
                        if(data.error) {
                            console.error(`error a la peticion de detener el chat: [${elementos.url}]`)}
                        elementos.enEmision = data.detenido;});}

                else{
                    elementos.enEmision = true;
                    postApiChat('on',elementos.url);}}});

        return elementos;}
}



