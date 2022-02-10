let messagesListLength = 0
const MAGIC = false
// Entrar na sala
let userName = ""
let nameObject = {
    name: userName
}
function login() {
    const valueInput = document.querySelector(".login input")
    userName = valueInput.value
    valueInput.value = ""
    nameObject.name = userName
    axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
}
function serverTestLoginSuccess(){
    const loginClass = document.querySelector(".login")
    loginClass.classList.add("hidden")
}
function serverTestLoginError() {
    const errorMsg = document.querySelector(".login .hidden")
    errorMsg.classList.remove("hidden")
    login()
}

// status usuario
function userStatus() {
    nameObject.name = userName
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject)
}
if (MAGIC){
setInterval(() => {
    userStatus()
}, 4000);}
// Faz uma requisição ao servidor para procurar pelas mensagens
function searchMessages() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(renderTheMessage)
}
if (MAGIC){
setInterval(() => {
    searchMessages()
}, 3000);}

let armz99 = ""
function renderTheMessage(success) {
    let messagesList = success.data
    const messages = document.querySelector(".messages")
    console.log(success.data)
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
    console.log(armz99 + "<--armz|| messageslist99-->" + messagesList[99])
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

// bonus 10s
function searchUsers(){
    axios.get("https://mock-api.driven.com.br/api/v4/uol/participants").then(renderUsers)
}

function renderUsers(users){
    users = users.data
    const usersClass = document.querySelector(".activity")
    for (let i = 0;  i < users.length; ++i) {
        usersClass.innerHTML += 
        `
        <div class="option">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${users[i].name}</p>
                </div>
        `
    }
}

function activity(){
    const activityClass = document.querySelector(".overlay")
    activityClass.classList.remove("hidden")

}

function exitActivity(shadowClass){
    console.log(shadowClass.parentNode);
    shadowClass.parentNode.classList.add("hidden")
}
searchUsers()
