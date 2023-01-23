export default class Popup {

    #id
    #clon

    constructor(propiedades = {}) {
        this.#getInstance(propiedades)
    }

    #getInstance({
        title = 'Título...',
        content = 'Contenido...',
        buttons = {
            accept: {
                title: 'Aceptar',
                callBack: () => console.log('Hola mundo')
            },
            close: {
                title: 'Salir'
            }
        }
    } = {}) {
        let modal = document.querySelector('#popup')
        this.#clon = modal.cloneNode(true)
        this.#id = `${this.#clon.id}-${this.aleatorio(1000, 99999999999999)}`
        this.#clon.id = this.#id
        modal.before(this.#clon)
        this.title = title
        this.content = content

        const buttonAccept = document.querySelector(`#${this.#clon.id} #accept`)
        buttonAccept.innerHTML = buttons.accept.title

        if (typeof buttons.accept.callBack === 'function') {
            buttonAccept.addEventListener('click', e => buttons.accept.callBack(e))
        }else{
            buttonAccept.addEventListener('click', e => this.close())
        }

        const buttonClose = document.querySelector(`#${this.#clon.id} #close`)
        buttonClose.innerHTML = buttons.close.title

        if (typeof buttons.close.callBack === 'function') {
            buttonClose.addEventListener('click', e => buttons.close.callBack(e))
        } else {
            buttonClose.addEventListener('click', e => this.dispose())
        }

    }

    get id() { 
        return this.#clon.id
    }

    /**
     * El título del cuadro de diálogo
     * @param {string} strTitle
     */
    set title(strTitle) {
        document.querySelector(`#${this.#clon.id} #title`).innerHTML = strTitle
        return this
    }

    /**
     * El contenido del cuadro de diálogo
     * @param {string} strContent
     */
    set content(strContent) {
        document.querySelector(`#${this.#clon.id} #content`).innerHTML = strContent
        return this
    }

    show() {
        if (this.#clon) {
            this.#clon.classList.remove("hidden")
        } else {
            console.log('El popup asociado a esta instancia fue eliminado de la memoria');
        }
        return this
    }

    close() {
        this.#clon.classList.add("hidden")
        return this
    }

    dispose() {
        // this.#clon.parentNode.removeChild(this.#clon); <-- esto equivale a lo siguiente:
        this.#clon.remove()
        this.#clon = null
    }

    /**
     * Devuelve un entero aleatorio entre min (inclusive) y max (inclusive).
     * El valor no es menor que min (es el siguiente entero mayor que min si min no es un entero) 
     * y no es mayor que max (el siguiente entero menor que max si max no es un entero).
    */
    aleatorio(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}
