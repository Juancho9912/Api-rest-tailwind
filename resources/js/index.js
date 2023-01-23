'use strict'

import Rest from './rest.js'
import Popup from './popup.js'
import Toast from './toast.js'
import Helpers from './Helpers.js'


document.addEventListener('DOMContentLoaded', async event => {


    document.querySelector('#toggle').addEventListener('click',e=>{
        document.querySelector('#menu').classList.toggle('hidden')
    })
    document.querySelectorAll('#menu > div > a').forEach((element) =>
        element.addEventListener(
            "click", event => chooseAction(event)
        )
    )
    document.querySelector('#search').addEventListener('click',e=>{
        e.preventDefault()
        Rest.search()
    })
    document.querySelector('#menu-boton').addEventListener('click',e=>{
        document.querySelector('#dropdownMenu').classList.toggle('hidden')
    })
    document.querySelector('#poblarJson').addEventListener('click',e=>{
        document.querySelector('#dropdownMenu').classList.add('hidden')
        Rest.poblarJson(e)
    })
    document.querySelector('#poblarLocal').addEventListener('click',e=>{
        document.querySelector('#dropdownMenu').classList.add('hidden')
        Rest.poblarLocal(e)
    })
    document.querySelector('#sincronizar').addEventListener('click',e=>{
        document.querySelector('#dropdownMenu').classList.add('hidden')
        Rest.sincronizar(e)
    })
    const data = await Helpers.fetchData('./data/url.json')
    Rest.url = data.url
    Rest.init()
})


function chooseAction(event) {
    event.preventDefault() // importante
    const option = event.target.innerHTML
    let url;

    if (option === 'Contáctenos') {
        displayContact()
    }else if  (option === 'Ver registros') {
        url = './resources/views/list.html'
        Helpers.loadPage(url, 'main').then(() =>
            Rest.retrieve()
        )
    }else if (option !== 'Utilidades') {
        Toast.info({
            message: `No hay nada para hacer con la opción "${option}"`,
            mode: 'warning'
        })
    } 
}
function displayContact() {

    

    let editor
    const popup = new Popup({
        title: 'Contáctenos',
        content: contactForm(),
        buttons: {
            accept: {
                title: 'Enviar',
                callBack: () => {
                    if (!Helpers.okForm(`#${popup.id} form`, () => editor.getContents().length > 20)) {
                        Toast.info({ 
                            message: 'Datos incorrectos o insuficientes', 
                            mode: 'warning' 
                        })
                    } else {
                        Toast.info({ message: 'Mensaje enviado' , mode: 'success'})
                        popup.dispose()
                    }
                }
            },
            close: {
                title: 'Cancelar',
            }
        }
    })

    editor = Helpers.createEditor(`#${popup.id} #messageForm`)
    popup.show()

}
const contactForm = () => `

    <form id="form-contact">
    <p class="text-center">
        Nos alegra mucho tu interés en estos animales míticos.
        Escríbenos y pronto nos pondremos en contacto.
    </p>
    <input type="email" class="w-full border-b-2 border-purple-700 outline-none rounded-sm p-2" id="correo"required placeholder="E-mail">


    <label for="message" class="inline-block my-4"> Cuéntanos…</label>
    <textarea id="messageForm" class=""></textarea>
    </form>`



