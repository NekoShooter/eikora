export function sintetizadorDeTexto(texto){
    const txt = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{1F1E6}-\u{1F1FF}]/gu, '');
    return txt.trim();}

export default class AdminMsn {
    #cola = [];
    #nuevoMensaje = false;
    #arranco = false;

    constructor(){
        this.agregarMensaje = this.agregarMensaje.bind(this);
        this.obtenerMensaje = this.obtenerMensaje.bind(this);
        this.eliminarMensajesDe = this.eliminarMensajesDe.bind(this);
        this.limpiar = this.limpiar.bind(this);}

    agregarMensaje(usuario,msn,frase = "dice"){
        const mensaje = sintetizadorDeTexto(msn);
        const No = this.#cola.length;

        if(mensaje == "" || this.#esRespuestaAusuario(mensaje)) return;
        if(!usuario ||!frase)
            this.#cola.push({msn:mensaje});
        else if(!this.#esSpam(usuario,msn)){
            if(usuario && this.#cola[this.#cola.length - 1]?.usuario == usuario)
                this.#cola[this.#cola.length - 1].msn += ' , ' + mensaje;
            else
                this.#cola.push({usuario:usuario,frase:frase,msn:mensaje});}

        this.#nuevoMensaje = No < this.#cola.length;}

    #esRespuestaAusuario(msn){ return msn.startsWith('@') && msn[1] != ''} 
    #esSpam(usuario,msn){
        for(let i = this.#cola.length - 1; i >= 0; i--){
            const v = this.#cola[i];
            if(v.usuario == usuario && v.msn == msn) return true;}
        return false;}

    obtenerMensaje(){
        const objetoMsn = this.#cola.shift();
        if(!this.#arranco) this.#arranco = !!objetoMsn;
        this.#validarmsn();
        return objetoMsn ? objetoMsn.usuario+' '+ objetoMsn.frase+' '+objetoMsn.msn : undefined;}

    get mensajesPendientes(){return this.#cola.length;}
    get arrancoSalida(){return this.#arranco;}
    get hayUnNuevoMensaje(){
        const val = this.#nuevoMensaje;
        this.#nuevoMensaje = false;
        return val;}

    #validarmsn(){if(!this.#cola.length) this.#nuevoMensaje = false;}

    eliminarMensajesDe(usuario){
        if(typeof(usuario) == "string")
            this.#cola = this.#cola.filter(mensaje => mensaje.usuario !== usuario);
        this.#validarmsn();}

    limpiar(){
        this.#nuevoMensaje = false;
        this.#cola = [];}
}