from flask import Flask, request, render_template, url_for
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
    url = request.form.get('url_valida')
    listaChats.append(Chat(url))
    return 201

@app.route('/api/arrancar',methods = ['POST'])
def arrancar():
    condicion = {'true':True, 'false':False}[request.form.get('onoff')]
    if len(listaChats) == 0:
        return 404
    else: 
        for chats in listaChats:
            if condicion[condicion]: chats.arrancar()
            else: chats.detener()
        return 201

if __name__ == '__main__':
    app.run(debug=True)
