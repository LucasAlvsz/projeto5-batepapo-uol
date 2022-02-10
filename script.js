let messagesListLength = 0
// Entrar na sala
let userName = ""
let nameObject = {
    name: userName
}
function login() {
    userName = prompt("Digite seu nome:")
    nameObject.name = userName
    let promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject)
    promisse.then(serverTestLoginSuccess).catch(serverTestLoginError)
}
function serverTestLoginSuccess(success) {

}
function serverTestLoginError(erro) {
    login()
}
login()

// status usuario
function userStatus(){
    nameObject.name = userName
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject)
}
setInterval(() => {
    userStatus()
}, 4000);
// Faz uma requisição ao servidor para procurar pelas mensagens
function searchMessages() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(renderTheMessage)
}

setInterval(() => {
    searchMessages()
}, 3000);

let armz99 = ""
function renderTheMessage(success) {
    let messagesList = success.data
    const messages = document.querySelector(".messages")
    console.log(messagesList[99])
    if (messagesList[99] != armz99){
        /*
    for (let i = 0; i <= messagesList.length; ++i) {
        if (messagesList[i].type == "status") {
            messages.innerHTML +=
                `
        <div class="message status">
                <p><span class="hour">(${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span>${messagesList[i].text}</p>
            </div>
        `
        } else if (messagesList[i].type == "message") {
            messages.innerHTML +=
                `
            <div class="message">
                <p><span class="hour">(${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span> para <span class="user"> ${messagesList[i].to}: </span> ${messagesList[i].text} </p>
            </div>
            `
        } else if (messagesList[i].type == "private_message" && messagesList[i].to == userName) {
            messages.innerHTML +=
                `
            <div class="message private">
                <p><span class="hour"> (${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span> reservadamente para <span class="user"> ${messagesList[i].to}: </span> ${messagesList[i].text} </p>
            </div>
            `
        }
        messages.scrollIntoView({ block: "end", behavior: "smooth" });
    }}*/
    armz99 = messagesList[99]
    console.log(armz99 +"<--armz|| messageslist99-->"+ messagesList[99])
}

function sendMessage() {
    const valueInput = document.querySelector("footer input")
    const messageObjetc = {
        from: userName,
        to: "Todos",
        text: valueInput.value,
        type: "message"
    }
    valueInput.value = ""
    axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(testarEnvio)
}

function testarEnvio(teste) {
    console.log(teste + "dale");
}


