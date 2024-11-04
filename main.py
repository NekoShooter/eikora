from flask import Flask, request, render_template,jsonify
from Almacen import almacen
from Chat import Chat

app = Flask(__name__)

listaChats = []

@app.route('/')
def root():
    return render_template('index.html')


@app.route('/mensajes')
def get():
    return almacen.entregar(),200


@app.route('/api/chat',methods = ['POST'])
def connectar():
    #url = request.get_data(as_text=True)
    data = request.get_json()
    url = data.get("url")

    print(f'nueva direccion agregada: {url}')
    for chats in listaChats:
        if chats.url == url:
            return jsonify(False)
        
    chat = Chat(url)

    if bool(chat):
        listaChats.append(chat)

    return jsonify(bool(chat))


@app.route('/api/chat/estado',methods = ['POST'])
def arrancar():
    data = request.get_json()
    onoff = {'on':True,'off':False}[data.get('estado')]
    url = data.get('url')

    respuesta = {
        "error":False,
        "detenido":False}
    
    if len(listaChats) == 0 or not isinstance(onoff,bool):
        respuesta["error"] = True
    else: 
        for chat in listaChats:
            if chat.url == url:
                chat.detener(not onoff)
                if onoff:
                    chat.mostrarPorConsola()
                    chat.arrancar()
                respuesta["detenido"] = chat.enEjecucion
                break

    return jsonify(respuesta)

@app.route('/api/chat/msn',methods=['GET'])
def msn():
    return jsonify(almacen.entregar())


if __name__ == '__main__':
    app.run(debug=True)
