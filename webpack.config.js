const ruta = require('path');

module.exports = {
        entry:'./src/core.js',
        output:{
            path: ruta.resolve(__dirname, 'static')
        },
    }