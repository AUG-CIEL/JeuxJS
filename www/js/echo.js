var ipServeur = '172.17.50.126';     // Adresse ip du serveur  
var ws;                             // Variable pour l'instance de la WebSocket.

window.onload = function () {
    if (TesterLaCompatibilite()) {
        ConnexionAuServeurWebsocket();
    }
    ControleIHM();
};

function TesterLaCompatibilite() {
    let estCompatible = true;
    if (!('WebSocket' in window)) {
        window.alert('WebSocket non supporté par le navigateur');
        estCompatible = false;
    }
    return estCompatible;
}

/*  ***************** Connexion au serveur WebSocket ********************   */
// 
function ConnexionAuServeurWebsocket() {
    ws = new WebSocket('ws://' + ipServeur + '/echo');   // Connexion à l'ip du serveur. 

    ws.onclose = function (evt) {
        window.alert('WebSocket close'); //  Websocket fermé
    };

    ws.onopen = function () {
        console.log('WebSocket open');       // Ouverture du webscoket
    };

    ws.onmessage = function (evt) {
        document.getElementById('messageRecu').value = evt.data;
    };
}

function ControleIHM() {
    document.getElementById('Envoyer').onclick = BPEnvoyer; //Bouton permettant d'envoyer le message. 

}

function BPEnvoyer() {


    ws.send(document.getElementById('messageEnvoi').value); //Envoi du message 
    // JSON

} 


    