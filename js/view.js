class View {
    constructor(parent) {
        this.root = parent
        this.newFriendAddedEvent = new Event()
        this.editFriendEvent = new Event ()
        this.deleteFriendEvent = new Event()
        this.confirmDateEvent = new Event()
        this.deleteHistoryEntry = new Event()
    }

    newFriendFormShow() {

        //prevents more than 1 new friend form
        if (document.getElementsByClassName("new-friend").length > 0) return


        const form = document.createElement("div")
        form.className = "new-friend"
        // Necesito input boxes para name, date, importance, periodicity, note
        form.innerHTML = `
        <label>Nombre: <input type="text" id="name"></label>
        <label>Prox. cita: <input type="date" id="date"></label>
        <label>Importancia: <input type="range" min="0" max="100" id="importance"></label>
        <label>Periodicidad: <input type="number" min="1" id="periodicity" value="7"></label>
        <label>Notas: <textarea id="note"></textarea></label>
        <button id="accept" class="button">Aceptar</button>
        <button id="cancel" class="button">Cancelar</button>
        `
        this.root.appendChild(form)

        const btnAccept = document.getElementById("accept")
        btnAccept.addEventListener("click", () => {
            const data = {
                name: document.getElementById("name").value,
                date: document.getElementById("date").value,
                importance: document.getElementById("importance").value,
                periodicity: document.getElementById("periodicity").value,
                note: document.getElementById("note").value
            }
            this.root.removeChild(form)
            this.newFriendAddedEvent.trigger(data)
        })
        const btnCancel = document.getElementById("cancel")
        btnCancel.addEventListener("click", () => {
            this.root.removeChild(form)
            // newFriendModelCallback({})
        })
    }
//----------------------------------------------------------------------------------------- FORM SHOW TO EDIT FRIEND!!!


    editFriendFormShow(friend) {

        //prevents more than 1 new friend form
        if (document.getElementsByClassName("new-friend").length > 0) return

        const {name, date, importance, periodicity, note} = friend


        const form = document.createElement("div")
        form.className = "new-friend"
        // Necesito input boxes para name, date, importance, periodicity, note
        form.innerHTML = `
        <label>Nombre: <input type="text" id="name" value="${name}" disabled> </label>
        <label>Prox. cita: <input type="date" id="date" value="${date}"></label>
        <label>Importancia: <input type="range" min="0" max="100" id="importance" value="${importance}"></label>
        <label>Periodicidad: <input type="number" min="1" id="periodicity" value="${periodicity}"></label>
        <label>Notas: <textarea id="note">${note}</textarea></label>
        <button id="accept" class="button">Aceptar</button>
        <button id="cancel" class="button">Cancelar</button>
        `
        this.root.appendChild(form)

        const btnAccept = document.getElementById("accept")
        btnAccept.addEventListener("click", () => {
            const data = {
                name: document.getElementById("name").value,
                date: document.getElementById("date").value,
                importance: document.getElementById("importance").value,
                periodicity: document.getElementById("periodicity").value,
                note: document.getElementById("note").value
            }
            this.root.removeChild(form)
            this.editFriendEvent.trigger(data)
        })
        const btnCancel = document.getElementById("cancel")
        btnCancel.addEventListener("click", () => {
            this.root.removeChild(form)
            // newFriendModelCallback({})
        })
    }


    //-------------------------------------------------------------------------------------
    redraw(friends) {
        // Eliminar todos los nodos
        while (this.root.firstChild) {
            this.root.removeChild(this.root.lastChild);
        }
        for (const f of friends) {
            const elem = document.createElement("div")
            elem.className = "box has-background-light"
            const elemSmallBox = document.createElement("div")
            elemSmallBox.className = "box"
            const elemLargeBox = document.createElement("div")
            elemLargeBox.className = "box is-hidden"



            const name = document.createElement("div")
            name.textContent = f.name
            const date = document.createElement("div")
            date.textContent = "Cita: " + f.date
            const importance = document.createElement("div")
            importance.textContent = "Importancia: " + f.importance
            const periodicity = document.createElement("div")
            periodicity.textContent = "Periodicidad: " + f.periodicity
            const note = document.createElement("div")
            note.textContent = "Nota: " + f.note
            const historyBox = document.createElement("div")
            //history.textContent = "Historia: " + f.history

            //----------------------------------------------------------------------------------- toggle Large Box

            function toggleVisibility (element){

                element.classList.toggle("is-hidden")
            }

            elemSmallBox.addEventListener("click", () =>{
                toggleVisibility(elemLargeBox)
            })

            //----------------------------------------------------------------------------------- update btn

            const btnEditFriend = document.createElement("button")
            btnEditFriend.id = "btnEditFriend"
            btnEditFriend.className = "button is-small"
            btnEditFriend.textContent = "edit friend"

            btnEditFriend.addEventListener('click', () => {
                    this.editFriendFormShow(f)
            })


            //----------------------------------------------------------------------------------- delete btn
            const btnDelete = document.createElement("button")
            const idAtt = document.createAttribute("id")
            idAtt.value = "btnDelete"
            btnDelete.setAttributeNode(idAtt)
            btnDelete.className = "button is-small"
            btnDelete.textContent = "delete"

            btnDelete.addEventListener('click', () => {
                if (window.confirm("do you want to delete friend?")) {
                    this.deleteFriendEvent.trigger(f.name)
                }
            })
//------------------------------------------------------------------------------------- confirm btn
            const btnConfirm = document.createElement("button")
            btnConfirm.id = "btnConfirm"
            btnConfirm.className = "button is-small"
            btnConfirm.textContent = "to history"

            btnConfirm.addEventListener("click", () => {
                if (window.confirm("do you want to confirm?")) {
                    const params = {
                        name: f.name,
                        date: f.date,
                        note: f.note
                    }
                    this.confirmDateEvent.trigger(params)
                }
            })
//-------------------------------------------------------------------------------------

            const btnShowHistory = document.createElement("button")
            btnShowHistory.id = "showHistory"
            btnShowHistory.className = "button is-small"
            btnShowHistory.textContent = "show history"

            btnShowHistory.addEventListener('click', () => {

                if (btnShowHistory.className === "showBtn") {

                    if (f.history.history.length === 0) {
                        return
                    }

                    for (const h of f.history.history) {

                        const {date, note, state} = h

                        const elem = document.createElement("div")
                        elem.className = "containerHistory"

                        const dateBox = document.createElement("div")
                        dateBox.textContent = "date" + date
                        const noteBox = document.createElement("div")
                        noteBox.textContent = "note" + note

                        const btnDeleteEntry = document.createElement("button")
                        btnDeleteEntry.id = "btnDeleteEntry"
                        btnDeleteEntry.className = "button is-small"
                        btnDeleteEntry.textContent = "delete entry"

                        btnDeleteEntry.addEventListener('click', () => {

                            elem.parentNode.removeChild(elem)

                            this.deleteHistoryEntry.trigger([f.name, date])
                        })


                        historyBox.appendChild(elem)

                        elem.appendChild(dateBox)
                        elem.appendChild(noteBox)
                        elem.appendChild(btnDeleteEntry)
                    }
                    btnShowHistory.textContent = "hide history"
                    btnShowHistory.className = "hideBtn"
                } else {

                    historyBox.innerHTML = ""
                    btnShowHistory.textContent = "show history"
                    btnShowHistory.className = "showBtn"

                }
            })

//-------------------------------------------------------------------------------------

            elemSmallBox.appendChild(name)
            elemLargeBox.appendChild(date)
            elemLargeBox.appendChild(importance)
            elemLargeBox.appendChild(periodicity)
            elemLargeBox.appendChild(note)
            elemLargeBox.appendChild(historyBox)
            elemLargeBox.appendChild(btnEditFriend)
            elemLargeBox.appendChild(btnDelete)
            elemLargeBox.appendChild(btnConfirm)
            elemLargeBox.appendChild(btnShowHistory)

            elem.appendChild(elemSmallBox)
            elem.appendChild(elemLargeBox)
            this.root.appendChild(elem)
        }
    }
}