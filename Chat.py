from chat_downloader import ChatDownloader
from Almacen import almacen

class Chat:
    def __init__(self,urlStream) -> None:
        self.estaActualizado = False
        self.detenerEjecucion = False
        self.__mostrar = False
        self.chat = None
        self.plataforma = 'e'
        self.plataformasDisponibles={'y':'youtube','t':'twitch'}
        self.url(urlStream)

    def url(self,urlStream) -> None:
        if not isinstance(urlStream,str):return
        self.direccion = urlStream

        if self.plataformasDisponibles['y'] in urlStream:
            self.plataforma = 'y'
        elif self.plataformasDisponibles['t'] in urlStream:
            self.plataforma = 't'
        else:
            return
        self.chat = ChatDownloader().get_chat(self.direccion)

    def detener(self,onoff:True) -> None:
        self.detenerEjecucion = bool(onoff)

    def arrancar(self) -> None:
        if self.chat == None:return
        for mensaje in self.chat:
            if(self.detenerEjecucion):break
            i = self.data(mensaje)
            almacen.agregar(i)
            if self.__mostrar:
                print(f'[{i['plataforma']['nombre']}] {'(Moderador) 'if i['esMod'] else ''}{'(Miembro) 'if i['esMiembro'] else ''}{i['usuario']} : {i['msn']} {{{i['tipo'] }}}')

    def data(self,datos)->dict:
        data = {
            'plataforma': {
                'id':self.plataforma,
                'nombre':self.plataformasDisponibles[self.plataforma]},
            'msn':datos['message'],
            'tipo':datos['message_type'],
            'tiempo':datos['timestamp'],
            'esMod':False}
        
        if self.plataforma == 't':
            data['usuario'] = datos['author']['display_name']
            data['esMod']= datos['author']['is_moderator']
            data['turbo'] = datos['author']['is_turbo']
            data['icon'] = datos['author']['icons']

        elif self.plataforma == 'y':
            data['usuario'] = datos['author']['name']
            data['esMiembro'] = False
            data['avatar'] = datos['author']['images'][0]['url']

            if 'badges' in datos['author']:
                lista = datos['author']['badges']
                info  = lambda idx: lista[idx if len(lista) > idx else 0]['title']
                data['esMiembro'] = 'Member' in info(0) or 'Member' in info(1)
                data['esMod'] = 'Moderator' == info(0) or 'Moderator' == info(1)

        return data
    
    def mostrarPorConsola(self,mostrar=True) -> None:
        self.__mostrar = mostrar