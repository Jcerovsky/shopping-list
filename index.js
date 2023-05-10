import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-list-eeed6-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if (inputValue.length > 0) {
        push(shoppingListInDB, inputValue)
    }
    
    
    clearInputFieldEl()
})

inputFieldEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let inputValue = inputFieldEl.value
    
    if (inputValue.length > 0) {
        push(shoppingListInDB, inputValue)
    }
    
    
    clearInputFieldEl()
    }
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        shoppingListEl.classList.remove('empty-list')
        let itemsArray = Object.entries(snapshot.val())
        itemsArray.sort((a, b) => a[1].localeCompare(b[1]))
        
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "Looks so empty here..."
        shoppingListEl.className = 'empty-list'
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}