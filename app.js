/* eslint-disable indent */
/*  *********************** Serveur Web ***************************   */// 
'use strict';

console.log('TP CIEL');

var express = require('express'); 
var exp = express();



exp.use(express.static(__dirname + '/www')); 

exp.get('/', function (req, res) {
    console.log('Reponse a un client'); 
    res.sendFile(__dirname + '/www/index.html');
}); 

exp.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erreur serveur express');
}); 



/*  *************** serveur WebSocket express *********************   */
// 
var expressWs = require('express-ws')(exp);

// Connexion des clients à la WebSocket /echo et evenements associés 
exp.ws('/echo', function (ws, req) {

    console.log('Connection WebSocket %s sur le port %s',
        req.connection.remoteAddress, req.connection.remotePort);

    ws.on('message', function (message) {
        message = ws._socket._peername.address  + ' : ' + message; 
        console.log('De %s %s, message :%s', req.connection.remoteAddress,
            req.connection.remotePort, message);
        aWss.broadcast(message);
    });

    ws.on('close', function (reasonCode, description) {
        console.log('Deconnexion WebSocket %s sur le port %s',
            req.connection.remoteAddress, req.connection.remotePort);
    });

});

/*  ****** Serveur web et WebSocket en ecoute sur le port 80  ********   */
//  
var portServ = 80;
exp.listen(portServ, function () {
    console.log('Serveur en ecoute');
}); 

/*  ****************** Broadcast clients WebSocket  **************   */
var aWss = expressWs.getWss('/echo');
var WebSocket = require('ws');
aWss.broadcast = function broadcast(data) {
    console.log("Broadcast aux clients navigateur : %s", data);
    aWss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
            client.send(data, function ack(error) {
                console.log("    -  %s-%s", client._socket.remoteAddress,
                    client._socket.remotePort);
                if (error) {
                    console.log('ERREUR websocket broadcast : %s', error.toString());
                }

            });
        }
    });
}; 

// QR 
var question = '?';
var bonneReponse = 0;

// Connexion des clients a la WebSocket /qr et evenements associés 
// Questions/reponses 
exp.ws('/qr', function (ws, req) {
    console.log('Connection WebSocket %s sur le port %s', // Connexion du websocket
        req.connection.remoteAddress, req.connection.remotePort);
    NouvelleQuestion(); //Ont pose la nouvelle question

    ws.on('message', TraiterReponse);    // Traitement de la réponse

    ws.on('close', function (reasonCode, description) {
        console.log('Deconnexion WebSocket %s sur le port %s',
            req.connection.remoteAddress, req.connection.remotePort);
    });



    function TraiterReponse(message) {
        console.log('De %s %s, message :%s', req.connection.remoteAddress,
            req.connection.remotePort, message);

        if (message == bonneReponse) {
            ws.send(' => Bonne réponse !'); // Affichage "Bonne réponse"
            //NouvelleQuestion();

            
        } else {
            // Mauvaise réponse
                  ws.send(' => Mauvaise réponse !'); // Affichage "Mauvaise réponse"
             //attente de 3 secondes pour poser une question

          
        } 
        setTimeout(() => {
            NouvelleQuestion(); // Attente de 3 min avant de redonner une réponse 
        }, 3000);

    }

    // Multipilication 

 //   function NouvelleQuestion() {
      //  var x = GetRandomInt(11);  // Ont génère un nombre X aléatoire entre 0 et 11 
       // var y = GetRandomInt(11); // Ont génère un nombre  Y aléatoire entre 0 et 11 
       // question = x + '*' + y + ' =  ?'; // Question = x * y (par exemple 10 * 11 )
       // bonneReponse = x * y;   // calcul de la multiplication donner 
   //     aWss.broadcast(question); 
    // }


    // base 2 : 
    function NouvelleQuestion() {
        // Tirer un entier aléatoire entre 0 et 255
        var nombreDecimal = Math.floor(Math.random() * 256);

        // Convertir en binaire sur 8 bits
        var nombreBinaire = nombreDecimal.toString(2).padStart(8, '0');

        // Créer la question
        question =  nombreBinaire;


        bonneReponse = nombreDecimal; // saisie la bonne réponse


        aWss.broadcast(question); // Envoi de la question
    }
 
    function GetRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));   // Ont génère un chiffre aléatoire jusu'au max. 
    }





});