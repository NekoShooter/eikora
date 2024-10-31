import json

class Almacen:
    def __init__(self) -> None:
        self.lista = []

    def entregar(self):
        entrega  = json.dumps(self.lista)
        self.lista = []
        return entrega
    
    def agregar(self,obj):
        self.lista.append(obj)
    
almacen = Almacen()