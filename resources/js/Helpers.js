export default class Helpers {
    static #editor

    static populateSelectList = (selector, items = [], value = '', text = '') => {
        let list = document.querySelector(selector)
        list.options.length = 0
        items.forEach(item => list.add(new Option(item[text], item[value])))
        return list // <-- OJO
    }
    static fetchData = async (url, options = {}, type = 'json') => {

        if (Object.entries(options).length > 0) {
            if (!("headers" in options)) {
                options.headers = {
                    "Content-Type": "application/json",
                }
            }
            if ("body" in options) {
                options.body = JSON.stringify(options.body)
            }
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }

        return await response[type]() // <-- OJO
    }
    static loadPage = async (url, container) => {
        const response = await fetch(url)
        const element = document.querySelector(container)
    
        if (response.ok) {
            const html = await response.text()
            element.innerHTML = html
            return element
        }
    
        throw new Error(`${response.status} - ${response.statusText}`)
    }
    static okForm(formSelector, callBack) {
        let ok = true
        let form = document.querySelector(formSelector)
        // si los datos del formulario son inválidos, forzar un submit
        if (!form.checkValidity()) {
            let tmpSubmit = document.createElement('button')
            form.appendChild(tmpSubmit)
            tmpSubmit.click()
            form.removeChild(tmpSubmit)
            ok = false
        }
        if (typeof callBack === 'function') {
            ok = ok && callBack()
        }
        return ok
    }
    static saveData(data){
        localStorage.removeItem('tablaData')
        localStorage.setItem('tablaData',JSON.stringify(data))
    }

    static get spanish() {
        return {
            "groups": {
                "item": "ítem",
                "items": "ítems",
            },
            "columns": {
            },
            "ajax": {
                "loading": "Cargando",
                "error": "Error",
            },
            "pagination": {
                "page_size": "Tamaño de página",
                "page_title": "Ver página",
                "first": "Primera",
                "first_title": "Primera página",
                "last": "Última",
                "last_title": "Última página",
                "prev": "Anterior",
                "prev_title": "Anterior página",
                "next": "Siguiente",
                "next_title": "Siguiente página",
                "all": "Todo",
            },
            "headerFilters": {
                "default": "Columna de filtro...",
                "columns": {}
            }
        }
    }

    static createEditor = (container) => {
        if (Helpers.#editor !== undefined) {
            Helpers.#editor.destroy()
        }

        Helpers.#editor = SUNEDITOR.create(document.querySelector(container), {
            lang: SUNEDITOR_LANG['es'],
            buttonList: [
                ['bold', 'underline', 'italic'],
                ['fontColor', 'hiliteColor'],
                ['undo', 'redo'],
                ['outdent', 'indent'],
                ['align', 'list', 'lineHeight']
            ],
            height: '140',
            defaultStyle: 'font-size: 1em',
            maxCharCount: "3000"
        })

        return Helpers.#editor;

    }

}
