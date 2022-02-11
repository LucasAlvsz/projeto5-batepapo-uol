const MAGIC = false
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
            console.log("teste")
            userName = valueInput.value
            valueInput.value = ""
            nameObject.name = userName
            axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
        }
    })
    // Login ao clicar em "Entrar"
    if (valueInput.value != "") {
        userName = valueInput.value
        valueInput.value = ""
        nameObject.name = userName
        axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
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
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject)
}
if (MAGIC) {
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
    }, 3000);
}
let count = 0
let messageListLog = []
let messagesList = []
let filteredMessages = []

function renderTheMessages(success) {
    messagesList = success.data
    const messages = document.querySelector(".messages")
    filteredMessages = messagesList.filter(x => !messageListLog.includes(x))
    console.log("filteredMessages: " + filteredMessages[99]);
    console.log("messagesList: " + messagesList[99]);
    console.log("messageListLog: " + messageListLog[99]);
    for (let i = 100; i <= filteredMessages.length; ++i) {
        if (filteredMessages.type == "status") {
            messages.innerHTML +=
                `
            <div class="message status">
                <p><span class="hour">(${filteredMessages.time}) </span> <span class="user"> ${filteredMessages.from} </span>${filteredMessages.text}</p>
            </div>
            `
        } else if (filteredMessages.type == "message") {
            messages.innerHTML +=
                `
            <div class="message">
            <p><span class="hour">(${filteredMessages.time}) </span> <span class="user"> ${filteredMessages.from} </span> para <span class="user"> ${filteredMessages.to}: </span> ${filteredMessages.text} </p>
            </div>
            `
        } else if (filteredMessages.type == "private_message" && filteredMessages.to == userName) {
            messages.innerHTML +=
                `
            <div class="message private">
            <p><span class="hour"> (${filteredMessages.time}) </span> <span class="user"> ${filteredMessages.from} </span> reservadamente para <span class="user"> ${filteredMessages.to}: </span> ${filteredMessagesList[i].text} </p>
            </div>
            `
        }
        messages.scrollIntoView({ block: "end", behavior: "smooth" });
    }
    if (count == 0)
        messageListLog = messagesList.slice()
    count += 1
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
    console.log(teste + "dale");
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
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${users[i].name}</p>
                </div>
        `
    }
}

function activity() {
    const activityClass = document.querySelector(".overlay")
    activityClass.classList.remove("hidden")

}

function exitActivity(shadowClass) {
    console.log(shadowClass.parentNode);
    shadowClass.parentNode.classList.add("hidden")
}


login()