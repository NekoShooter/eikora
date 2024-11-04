from chat_downloader import ChatDownloader
from Almacen import almacen

class Chat:
    def __init__(self,urlStream) -> None:
        self.estaActualizado = False
        self.detenerEjecucion = False
        self.enEjecucion = False
        self.__mostrar = False
        self.chat = None
        self.plataforma = 'e'
        self.plataformasDisponibles={'y':'youtube','t':'twitch'}
        self.asignarUrl(urlStream)

    def asignarUrl(self,urlStream) -> None:
        if not isinstance(urlStream,str):return
        self.url = urlStream

        if self.plataformasDisponibles['y'] in urlStream:
            self.plataforma = 'y'
        elif self.plataformasDisponibles['t'] in urlStream:
            self.plataforma = 't'
        else:
            return
        try:
            self.chat = ChatDownloader().get_chat(self.url)
            print('tipo: ',self.chat)
        except:
            self.url = None
            self.chat = None
    # si se castea a bool para saber si el objeto es valido
    def __bool__(self)->bool:
        return bool(self.url)

    def detener(self,onoff:True) -> None:
        self.detenerEjecucion = bool(onoff)

    def arrancar(self) -> None:
        if self.chat == None or self.enEjecucion:return
        self.enEjecucion = True
        for mensaje in self.chat:
            if(self.detenerEjecucion):
                self.enEjecucion = False
                break
            i = self.data(mensaje)
            almacen.agregar(i)
            if self.__mostrar:
                print(f'[{i['plataforma']['nombre']}] {'(Moderador) 'if i['esMod'] else ''}{i['usuario']} : {i['msn']} {{{i['tipo'] }}}')

    def data(self,datos)->dict:
        data = {
            'plataforma': {
                'id':self.plataforma,
                'nombre':self.plataformasDisponibles[self.plataforma]},
            'msn':datos['message'],
            'tipo':datos['message_type'],
            'tiempo':datos['timestamp'],
            'esMiembro':False,
            'esMod':False}
        
        if data['plataforma']['id'] == 't':
            data['usuario'] = datos['author']['display_name']
            data['esMod']= datos['author']['is_moderator']
            data['esSub'] = datos['author']['is_subscriber']
            data['turbo'] = datos['author']['is_turbo']

        elif data['plataforma']['id'] == 'y':
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