export default class Toast {

    /*
        Al contrario de Bootstrap, esta clase no requiere elementos previamente creados en index.html
        Simplemente use:
        Toast.info({ 
            message: 'bla bla bla...', 
            mode: 'success' // 'warning' | 'danger' | 'info' 
        })
    */

    static #init(mode) {
        // los siguientes colores deben corresponder a los colores "mode", por qué?
        // por una falla en el intérprente que me permite engañarlo
        // class="bg-green-500 bg-yellow-400 bg-red-500 bg-blue-500"

        if (mode === 'success') {
            return {
                title: 'Acción exitosa',
                colour: 'green-500',
                icon: `
                    <svg class="animate-bounce w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"/>
                    </svg>`
            }
        } else if (mode === 'warning') {
            return {
                title: '¡Cuidado!',
                colour: 'yellow-400',
                icon: `
                    <svg class="animate-bounce w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"/>
                    </svg>`
            }
        } else if (mode === 'danger') {
            return {
                title: 'Lo siento...',
                colour: 'red-500',
                icon: `
                <svg class="animate-bounce w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"/>
                </svg>`
            }
        } else {
            return {
                title: 'Aviso',
                colour: 'blue-500',
                icon: `
                    <svg class="animate-bounce w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"/>
                    </svg>`
            }
        }
    }

    /**
     * Estándar para la presentaciones de errores, advertencias o información general
     * @param {String} message El mensaje que se debe mostrar
     * @param {String} mode Indica el tipo de toast a mostrar: 'success', 'warning', 'danger' o 'info'
     * @param {string} error Preferiblemente aquellos mensajes reportados por el entorno de ejecución
     */
    static info({ message = '', mode = 'info', error = '' } = {}) {

        // https://dmitripavlutin.com/javascript-object-destructuring/
        const { title, colour, icon } = this.#init(mode)

        const id = `toast-${this.getRandomInt(10000, 99999999999999)}`

        // https://tailwind-elements.com/docs/standard/components/toast/
        document.querySelector('body').insertAdjacentHTML('afterbegin', `
            <div id="${id}" class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 absolute top-2 right-2">
                <div class="flex items-center justify-center w-12 bg-${colour}">
                    ${icon}
                </div>
                
                <div class="px-4 py-2 -mx-3">
                    <div class="mx-3">
                        <span class="font-semibold text-${colour} dark:text-${colour}">${title}</span>
                        <p class="text-sm text-gray-600 dark:text-gray-200">${message}</p>
                    </div>
                </div>
            </div>`
        )

        setTimeout(() => document.querySelector(`#${id}`).remove(), 3000)

        if (error) {
            console.error(`Houston, tenemos un problema: ${error}`)
        }
    }

    /**
     * Devuelve un entero aleatorio entre min (inclusive) y max (inclusive).
     * El valor no es menor que min (es el siguiente entero mayor que min si min no es un entero) 
     * y no es mayor que max (el siguiente entero menor que max si max no es un entero).
     */
    static getRandomInt = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}