import {Configurador, UrlChats} from "./interfaz.js";

window.addEventListener("load", function() {
    const configuracion = new Configurador;
    const urlAdmin = new UrlChats;
    configuracion.accederAmicro();
});
