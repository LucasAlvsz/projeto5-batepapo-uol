// -------- MAGIC NUMBERS ---------- \\
const MESSAGESUPDATETIME = 3000
const STATUSUPDATETIME = 5000
const USERSONLINEUPDATETIME = 10000
const TEMPOLOADING = 1500
// ---------------------------------- \\
let userName
let nameObject = {
    name: ""
}
let messageObjetc = {
    from: "",
    to: "",
    text: "",
    type: ""
}
let logged = false
let userSelected = "Todos"
let messageVisibility = "message"
let usersListLog = []
let index = 0
let firstRunRenderMessages = true
let messageListLog = ""

function login() {
    const valueInput = document.querySelector(".login input")
    valueInput.addEventListener('keydown', function (event) {
        if (event.keyCode == 13 && valueInput.value != "") {
            userName = valueInput.value
            valueInput.value = ""
            nameObject.name = userName
            axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
        }
    })
    if (valueInput.value != "") {
        userName = valueInput.value
        valueInput.value = ""
        nameObject.name = userName
        axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nameObject).then(serverTestLoginSuccess).catch(serverTestLoginError)
    }
}

function serverTestLoginSuccess() {
    logged = true
    const loginClass = document.querySelector(".login")
    document.querySelector(".login .options").remove()
    loginClass.innerHTML +=
        `
    <div class="loading">
            <img src="img/loading.gif" alt="carregando">
            <p>Entrando...</p>
        </div> 
    `
    setTimeout(() => {
        loginClass.classList.add("hidden")
    }, TEMPOLOADING)
}

function serverTestLoginError() {
    const errorMsg = document.querySelector(".login .hidden")
    errorMsg.classList.remove("hidden")
    login()
}

function userStatus() {
    if (logged) {
        nameObject.name = userName
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameObject).then().catch(offline)
    }
}

function offline() {
    location.reload()
}

setInterval(() => {
    userStatus()
}, STATUSUPDATETIME)


function searchMessages() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promisse.then(renderMessages)
}

setInterval(() => {
    searchMessages()
}, MESSAGESUPDATETIME)

function renderMessages(success) {
    let messagesList = success.data
    const messages = document.querySelector(".messages")
    // Verifica se é a primeira vez que a função é executada
    if (!firstRunRenderMessages) {
        // Compara o ultimo elemento da lista de mensagens com a ultima mensagem armazenada
        for (let i = (messagesList.length - 1); i; i--) {
            if (messageListLog == (messagesList[i].from + messagesList[i].text + messagesList[i].time)) {
                index = i + 1
                break
            } else if (i == 0) {
                index = i
            }
        }
    }

    for (let i = index; i <= messagesList.length - 1; i++) {
        if (messagesList[i].type == "status") {
            messages.innerHTML +=
                `
            <div class="message status" data-identifier="message">
                <p><span class="hour">(${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span>${messagesList[i].text}</p>
            </div>
            `
        } else if (messagesList[i].type == "message") {
            messages.innerHTML +=
                `
            <div class="message" data-identifier="message">
            <p><span class="hour">(${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span> para <span class="user"> ${messagesList[i].to}: </span> ${messagesList[i].text} </p>
            </div>
            `
        } else if (messagesList[i].type == "private_message" && (messagesList[i].to == userName || messagesList[i].to == "Todos" || messagesList[i].from == userName)) {
            messages.innerHTML +=
                `
            <div class="message private" data-identifier="message">
            <p><span class="hour"> (${messagesList[i].time}) </span> <span class="user"> ${messagesList[i].from} </span> reservadamente para <span class="user"> ${messagesList[i].to}: </span> ${messagesList[i].text} </p>
            </div>
            `
        }
        messages.scrollIntoView({ block: "end", behavior: "smooth" })
    }
    firstRunRenderMessages = false

    let lastMessageIndex = messagesList.length - 1
    messageListLog = (messagesList[lastMessageIndex].from + messagesList[lastMessageIndex].text + messagesList[lastMessageIndex].time)
}

function sendMessage() {
    const valueInput = document.querySelector("footer input")
    valueInput.addEventListener('keydown', function (event) {
        if (event.keyCode == 13 && valueInput.value != "") {
            messageObjetc = {
                from: userName,
                to: userSelected,
                text: valueInput.value,
                type: messageVisibility
            }
            valueInput.value = ""
            axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(searchMessages).catch(offline)
        }
    })
    if (valueInput.value != "") {
        messageObjetc = {
            from: userName,
            to: userSelected,
            text: valueInput.value,
            type: messageVisibility
        }
        valueInput.value = ""
        axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", messageObjetc).then(searchMessages).catch(offline)
    }
}

function searchUsers() {
    axios.get("https://mock-api.driven.com.br/api/v4/uol/participants").then(renderUsers)
}

setInterval(() => {
    searchUsers()
}, USERSONLINEUPDATETIME);

function renderUsers(users) {
    users = users.data
    const usersClass = document.querySelector(".activitys .users")
    const allUsers = [...usersClass.querySelectorAll(".option")]
    let filteredUsersOff = filterUsersOff(users, usersListLog)
    for (let i = 0; i < filteredUsersOff.length; i++) {
        for (let j = 0; j < allUsers.length; j++) {
            if (filteredUsersOff[i] == allUsers[j].id) {
                if (allUsers[j].querySelector(".selected"))
                    selectUser("todos")
                allUsers[j].remove()
            }
        }
    }
    let filteredUsers = users.filter(filterUsers)
    for (let i = 0; i < filteredUsers.length; ++i) {
        usersClass.innerHTML +=
            `
        <div class="option" id="${filteredUsers[i].name}" data-identifier="participant">
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

function filterUsersOff(users, usersListLog) {
    let arrayUsers = []
    let arrayLog = []
    for (let i = 0; i < usersListLog.length; i++) {
        arrayUsers.push(usersListLog[i].name)
    }
    for (let i = 0; i < users.length; i++) {
        arrayLog.push(users[i].name)
    }
    let difference = arrayUsers.filter(x => !arrayLog.includes(x));
    return difference
}

function activity() {
    const activityClass = document.querySelector(".overlay")
    activityClass.classList.remove("hidden")
}

function exitActivity(shadowClass) {
    shadowClass.parentNode.classList.add("hidden")
}

function selectUser(element) {
    if (element == "todos") {
        document.querySelector(".users .todos").innerHTML +=
            `
        <div class="selected">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
        `
        document.querySelector("footer p span").innerHTML = "Todos"
        userSelected = "Todos"
    }
    else {
        const optionClass = element.parentNode
        const usersClass = optionClass.parentNode
        const userName = optionClass.querySelector("p").innerHTML
        if (usersClass.querySelector(".selected") != optionClass && usersClass.querySelector(".selected")) {
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
sendMessage()
searchMessages()
searchUsers()
