const MAGIC = true
const MESSAGESUPDATETIME = 3000
const STATUSUPDATETIME = 50000
const USERSONLINEUPDATETIME = 10000

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
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject).then(teste()).catch(reload)
}
function teste() {
    console.log("status enviado");
}
function reload() {
    console.log("reload")
    location.reload();
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
    promisse.then(renderMessages)
}
if (MAGIC) {
    setInterval(() => {
        console.log("Procurando mensagens")
        searchMessages()
    }, MESSAGESUPDATETIME);
}
let index = 0
let firstRun = true
let messageListLog = ""
let filteredMessages = []
function renderMessages(success) {
    let messagesList = success.data
    const messages = document.querySelector(".messages")
    // Verifica se é a primeira vez que a função é executada
    /*if (!firstRun) {
        // Compara o ultimo elemento da lista de mensagens com a ultima mensagem armazenada
        for (let i = 99; i; i--) {
            if (messageListLog == (messagesList[i].from + messagesList[i].text + messagesList[i].time)) {
                i = index
                console.log("vou parar");
                break
            }else if(i == 0){
                i = index
            }
        }
    }*/
    messages.innerHTML = ""
    for (let i = 0; i < messagesList.length; ++i) {
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
        } else if (messagesList[i].type == "private_message" && (messagesList[i].to == userName || messagesList[i].to == "Todos" || messagesList[i].from == userName)) {
            messages.innerHTML +=
                `
            <div class="message private">
            <p><span class="hour"> (${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span> reservadamente para <span class="user"> ${messagesList[i].to}: </span> ${messagesList[i].text} </p>
            </div>
            `
        }
        //, behavior: "smooth" 
        messages.scrollIntoView({ block: "end" });
    }
    //firstRun = false
    //messageListLog = messagesList[99].from + messagesList[99].text + messagesList[99].time
}

let userSelected = "Todos"
let messageVisibility = "message"
function sendMessage() {
    const valueInput = document.querySelector("footer input")
    console.log(userName, userSelected, valueInput.value, messageVisibility + "  aaaaaaaaaaaaaa");
    // Enviar mensagem teclando "Enter"
    valueInput.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            const messageObjetc = {
                from: userName,
                to: userSelected,
                text: valueInput.value,
                type: messageVisibility
            }
            valueInput.value = ""
            axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(testarEnvio)
        }
    })
    // Enviar mensagem ao clicar no icone
    if (valueInput.value != "") {
        const messageObjetc = {
            from: userName,
            to: userSelected,
            text: valueInput.value,
            type: messageVisibility
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

setInterval(() => {
    searchUsers()
}, USERSONLINEUPDATETIME);

let usersListLog = []
function renderUsers(users) {
    users = users.data
    const usersClass = document.querySelector(".activity .users")
    let filteredUsers = users.filter(filterUsers);
    console.log(filteredUsers);
    for (let i = 0; i < filteredUsers.length; ++i) {
        usersClass.innerHTML +=
            `
        <div class="option">
                    <ion-icon name="person-circle" onclick="selectUser(this)"></ion-icon>
                    <p onclick="selectUser(this)">${filteredUsers[i].name}</p>
                </div>
        `
    }
    usersListLog = users.slice()
}
function filterUsers(users) {
    for (let i = 0; i < usersListLog.length; i++) {
        if (users.name == usersListLog[i].name)
            return false
    }
    return true
}

function activity() {
    const activityClass = document.querySelector(".overlay")
    activityClass.classList.remove("hidden")

}

function exitActivity(shadowClass) {
    shadowClass.parentNode.classList.add("hidden")
}

function selectUser(element) {
    const optionClass = element.parentNode
    const usersClass = optionClass.parentNode
    const userName = optionClass.querySelector("p").innerHTML
    // Caso o elemento a ser clicado já não esteja selecionado seleciona o mesmo
    if (usersClass.querySelector(".selected") != optionClass) {
        usersClass.querySelector(".selected").remove()
        optionClass.innerHTML +=
            `
        <div class="selected">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
        `
    }
    document.querySelector("footer p span").innerHTML = userName
    userSelected = userName
}
function selectVisibility(element) {
    const optionClass = element.parentNode
    const visibilityClass = optionClass.parentNode
    const visibility = optionClass.querySelector("p").innerHTML
    if (visibilityClass.querySelector(".selected") != optionClass) {
        visibilityClass.querySelector(".selected").remove()
        optionClass.innerHTML +=
            `
        <div class="selected">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
        `

    }
    console.log(visibility);
    if (visibility == "Reservadamente") {
        document.querySelector("footer p b").innerHTML = "(reservadamente)"
        messageVisibility = "private_message"
    }
    else {
        document.querySelector("footer p b").innerHTML = "(público)"
        messageVisibility = "message"
    }
}

login()

