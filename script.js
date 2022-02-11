const MAGIC = true
// Entrar na sala
let userName
let nameObject = {
    name: userName
}
function login() {
    const valueInput = document.querySelector(".login input")
    // Login ai teclar "Enter"
    valueInput.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            userName = valueInput.value
            valueInput.value = ""
            nameObject.name = userName
            axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
            return true
        }
    })
    // Login ao clicar em "Entrar"
    if (valueInput.value != "") {
        userName = valueInput.value
        valueInput.value = ""
        nameObject.name = userName
        axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
        return true
    }
}
function serverTestLoginSuccess() {
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
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject).then(teste())
}
function teste(){
    console.log("status enviado");
}
if (MAGIC) {
    console.log("status");
    setInterval(() => {
        userStatus()
    }, 4000);
}
// Faz uma requisição ao servidor para procurar pelas mensagens
function searchMessages() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(renderTheMessages)
}
if (MAGIC) {
    setInterval(() => {
        searchMessages()
    }, 500);
}
let count = 0
let messageListLog = []
let messagesList = []
let filteredMessages = []
function renderTheMessages(success) {
    messagesList = success.data
    const messages = document.querySelector(".messages")
    //filteredMessages = messagesList.filter(x => !messageListLog.includes(x))
    //for (let i = 0; i <= messagesList.length; ++i) {
        //console.log("entrei");
        if(count == 0)
            messageListLog = messagesList.slice()
        if (messagesList[99].text != messageListLog[99].text){
        let i = 99
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
    }
    count +=1
    messageListLog = messagesList.slice()
}


function sendMessage() {
    const valueInput = document.querySelector("footer input")
    // Enviar mensagem teclando "Enter"
    valueInput.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            const messageObjetc = {
                from: userName,
                to: "Todos",
                text: valueInput.value,
                type: "message"
            }
            valueInput.value = ""
            axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(testarEnvio)
        }
    })
    // Enviar mensagem ao clicar no icone
    if (valueInput.value != "") {
        const messageObjetc = {
            from: userName,
            to: "Todos",
            text: valueInput.value,
            type: "message"
        }
        valueInput.value = ""
        axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(testarEnvio)
    }
}

function testarEnvio(teste) {
    console.log("Mensagem enviada");
}

// bonus 10s
function searchUsers() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/participants").then(renderUsers)
}

function renderUsers(users) {
    users = users.data
    const usersClass = document.querySelector(".activity")
    for (let i = 0; i < users.length; ++i) {
        usersClass.innerHTML +=
            `
        <div class="option">
                    <ion-icon name="person-circle" onclick=""></ion-icon>
                    <p onclick="">${users[i].name}</p>
                </div>
        `
    }
}

function activity() {
    const activityClass = document.querySelector(".overlay")
    activityClass.classList.remove("hidden")

}

function exitActivity(shadowClass) {
    shadowClass.parentNode.classList.add("hidden")
}

function selectUser(){
    
}


login()
searchUsers()
