import Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator.es2015.js'   
import Popup from './popup.js'
import Helpers from './Helpers.js'
import Toast from './toast.js'



export default class Rest {
    popup
    #url 

    set url(url = 'https://crudcrud.com/') {
        this.#url = url
    }

    get url() {
        return this.#url
    }

/// **************************** INIT Y RETRIVE **********************************************************************
    static init = async () => {
        const data2 = localStorage.getItem('tablaData')
        
       
        let result = await fetch('./data/url.json')
        
        if (!result.ok) {
            document.querySelector('main').innerHTML = `
            <div class="bg-red-500" role="alert">
            No se tiene acceso al archivo de configuración
            ./data/url.json</div>`
            Toast.info({
                message: 'No hay acceso a la base de datos',
                mode: 'danger'
            })   
            return
        }

        let data = await result.json()
        this.url = data.url

        
        result = await fetch(this.url)
            .catch(error => Toast.info({
                message: 'Fallo el intento de conexion',
                mode: 'danger',
                error: `fetch reporta: '${error}'`
            })
            ) ?? { ok: false }
        if (result.ok) {
            
            this.restorationOptions(result)
        } else {
            document.querySelector('main').innerHTML = `
            <div class="bg-red-500" role="alert">
                    No hay acceso a <a href="${this.url}" class="text-blue-500" target="_blank"
                    rel="noopener noreferrer">{"crud":"crud"}
                    </a> es posible que se le haya vencido la clave de acceso
                    o que haya un error en la URL. <br>Por favor revise el
                    archivo ./data/url.json para hacer los ajustes necesarios.
                    Todas las acciones CRUD fallarán si el problema persiste.
            </div>`
        }
    }

    static retrieve = async () => {
        const result = await fetch(this.url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).catch(error => Toast.info({
            message: 'Fallo el intento de conexion',
            mode: 'danger',
            error: `fetch reporta: '${error}'`
        })) ?? {ok: false} 

        console.log(result);

        if (!result.ok) {
            Toast.info({
                message: 'La respuesta del servidor reporta un fallo.',
                mode: 'danger',
                error: result.statusText
            })
            document.querySelector('#unicorns-table').innerHTML =''
            return
        }

        const dataUnicorns = await result.json()
        console.log(dataUnicorns);

        const btnUpdate = (cell, formatterParams) => `<i class="far fa-edit"></i>`
        const btnTrash = function(cell, formatterParams) {return "<i class='far fa-trash-alt'></i>";};
        
        //initialize table
        const table = new Tabulator("#unicorns-table", {
            data: dataUnicorns, //assign data to table
            layout: 'fitColumns',
            pagination: "local",
            paginationSize: 6,
            langs: { "es-419": Helpers.spanish },
            columns: [
                { field: "_id", visible: true },
                { title: "#", width: 40, field: "example", formatter: "rownum"},
                { 
                    formatter: btnUpdate,
                    width: 40, 
                    hozAlign: "center",
                    cellClick: (e, cell) => this.updateRecord(e,cell,table) 
                },
                {
                    formatter:btnTrash,
                    width:40, hozAlign:"center",
                    cellClick:(e,cell)=>this.deleteRecord(e,cell,table)
                },
                
                { title: "Nombre del unicornio", field: "name" },
                { title: "Color", field: "colour", width: 100 },
                { title: "Edad", field: "age", width: 80 },
                
            ],
            
            footerElement: `<button id="add-row"   
                class="tabulator-page">
                Agregar un unicornio
                </button>`

            
        });
        document.querySelector("#unicorns-table #add-row").addEventListener('click', e => this.createRecord(table))

        table.setLocale("es-419")


    }


    static get #unicorn() {
        const name = document.querySelector(`#${this.popup.id} #name`).value.trim()
        const age = document.querySelector(`#${this.popup.id} #age`).value.trim()
        const colour = document.querySelector(`#${this.popup.id} #colour`).value.trim()
        
        return { name, age, colour }
    }
/// *******************************CREATE Y CREATERECORD************************************************

    static create = async (table) => {

        const unicorn = this.#unicorn
        //const url = `https://crudcrud.com/api/${this.#key}/unicorns`

        if (!Helpers.okForm(`#${this.popup.id} form`,()=> unicorn.name && unicorn.age && unicorn.colour)){
            Toast.info({
                message: 'Datos incompletos o incorrectos', mode: 'warning' })
            return
        }


        let result = await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unicorn)
        }).catch(error => Toast.info({
            message: 'Error al solicitar la creacion del registro',
            mode: 'danger',
            error: `fetch reporta: '${error}'`
        })) ?? {ok: false} 

        if (!result.ok) {
            Toast.info({
                message: 'Problemas en la creacion del registro',
                mode: 'danger',
                error: result
            })
            return
        }else{
            Toast.info({
                message:'Se agrego correctamente',
                mode: 'success'
            })
        }

        table.addRow(await result.json())
        this.popup.dispose()
        Helpers.saveData(table.getData())
        
        

    }
    static createRecord = (table) => {
        this.popup = new Popup({
            title: 'Crear registro',
            content: Rest.getForm(),
            buttons: {
                accept: {
                    title: 'Crear registro',
                    callBack: () => Rest.create(table)
                },
                close: {
                    title: 'Cancelar',
                }
            }
        }).show()
    }
    static getForm = (unicorn = { name: '', age: '', colour: '' }, readOnly = '') => `
    <form class="w-full md:p-8">
        <input type="text" class="w-full border-b-2 border-purple-700 outline-none rounded-sm p-2" placeholder="Nombre" id="name"value="${unicorn.name}" required minlength="5" maxlength="50" ${readOnly}>

        <div class="w-full my-8 gap-8 flex-col flex md:flex-row">
            <input type="number" class="border-b-2 border-purple-700 outline-none rounded-sm p-2"id="age" min="1" max="99"   value="${unicorn.age}" placeholder="Edad" required ${readOnly}>  
            <input type="text" class="border-b-2 border-purple-700 outline-none rounded-sm p-2" id="colour" placeholder="Color" value="${unicorn.colour}" required minlength="4" maxlength="30" ${readOnly}>    
        </div>
    
    </form>
    `

    /// *******************************UPDATE Y UPDATERECORD************************************************ 

    static update = async (popup, row,table) => {

        if (!Helpers.okForm(`#${this.popup.id} form`,()=> row.getData().name && row.getData().age && row.getData().colour)){
            Toast.info({
                message: 'Datos incompletos o incorrectos' , mode: 'warning'
            })
            return
        }

        const _id = row.getData()._id // recuperar el ID oculto en la tabla
        const unicorn = this.#unicorn

        

        let result = await fetch(`${this.url}/${_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unicorn) // enviar al objeto en formato JSON
        }).catch(error => Toast.info({
            message: 'Error al solicitar la actualizacion del registro',
            mode: 'danger',
            error: result
        })) ?? { ok: false }

        if (!result.ok) {
            Toast.info({
                message: 'Problemas en la actualizacion del registro',
                mode: 'danger',
                error: result
            })
            return
        }else{
            Toast.info({
                message:'Se actualizo correctamente',
                mode: 'success'
            })
        }


        row.update(unicorn) // actualizar los datos de la fila afectada
        popup.dispose()
        Helpers.saveData(table.getData())
    }
    
    static updateRecord = (e, cell,table) => {
        // recuperar los datos del unicornio a modificar
        const unicorn = cell.getRow().getData()

        this.popup = new Popup({
            title: 'Actualizar registro',
            // mostrar un formulario con los datos del unicornio
            content: Rest.getForm(unicorn),
            buttons: {
                accept: {
                    title: 'Actualizar',
                    // permitir actualizar los datos del unicornio
                    callBack: () => Rest.update(this.popup, cell.getRow(),table)
                },
                close: {
                    title: 'Cancelar',
                }
            }
        }).show()
    }

/// *******************************DELETE Y DELETERECORD************************************************    
    
    static delete = async (popup, row,table) => {
        const _id = row.getData()._id

        let result = await fetch(`${this.url}/${_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).catch(error => Toast.info({
            message: 'Error al solicitar la eliminacion del registro',
            mode: 'danger',
            error: result
        })) ?? { ok: false }

        if (!result.ok) {
            Toast.info({
                message: 'Problemas en la eliminacion del registro',
                mode: 'danger',
                error: result
            })
            return
        }else{
            Toast.info({
                message:'Se elimino correctamente',
                mode: 'success'
            })
        }

        row.delete()
        popup.dispose()
        Helpers.saveData(table.getData())
    }

    static deleteRecord = (e, cell,table) => {
        const unicorn = cell.getRow().getData()
        this.popup = new Popup({
            title: 'Eliminar registro',
            content: `Eliminar al unicornio "${unicorn.name}"`,
            buttons: {
                accept: {
                    title: 'Eliminar',
                    callBack: () => Rest.delete(this.popup, cell.getRow(),table)
                },
                close: {
                    title: 'Cancelar',
                }
            }
        }).show()
    }

/// ******************************* SEARCH   ************************************************    

    static search = async ()=>{
        const id = document.querySelector('#busqueda').value
        if (id !== '' ) {
            try {
                const result = await fetch(`${this.url}/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                })
                const unicorn = await result.json()

                this.popup = new Popup({
                    title: 'Registro encontrado',
                    // mostrar un formulario con los datos del unicornio
                    content: Rest.getForm(unicorn,'readOnly'),
                    buttons: {
                        accept: {
                            title: 'Aceptar',
                            
                        },
                        close: {
                            title: 'Cancelar',
                        }
                    }
                }).show()
            } catch (error) {
                this.popup = new Popup({
                    title: 'Alerta',
                    // mostrar un formulario con los datos del unicornio
                    content:'No encontrado',
                    buttons: {
                        accept: {
                            title: 'Aceptar',
                            // permitir actualizar los datos del unicornio
                             callBack: () => this.popup.close()
                        },
                        close: {
                            title: 'Cancelar',
                        }
                    }
                }).show()
            }
        }  
    }

/// *******************************POBLAR Y SINCRONIZAR ************************************************    

    static poblarJson = async (e) => {
        const data = await Helpers.fetchData('./data/unicorns.json')
        this.restoreData(e,data)
    }
    static poblarLocal = async (e) => {
        const data = localStorage.getItem('tablaData')
        this.restoreData(e,JSON.parse(data))
    }

    static sincronizar = async (e) => {
        e.preventDefault()
        const dataLocal = localStorage.getItem('tablaData')

        const result = await fetch(this.url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        const dataBase = await result.json()

        const union = [...dataBase,...JSON.parse(dataLocal)].filter(
            (item,index,array)=> array.findIndex(t => t._id == item._id || t.name == item.name) == index)
        
        // const union = [...dataBase,...JSON.parse(dataLocal)].filter(
        //     (item,index,array)=> array.findIndex(t => t._id == item._id || t.name == item.name) == index)
        let eliminar = dataBase
                .filter(x => !union.includes(x))
                .concat(union.filter(x => !dataBase.includes(x)));

        eliminar.forEach(async item => {
            let result = await fetch(`${this.url}/${item['_id']}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
        });    
        
        Toast.info({
            message: 'Sincronizacion completa',
            mode: 'success'
        })
        localStorage.removeItem('tablaData')
        localStorage.setItem('tablaData',JSON.stringify(union))

        this.retrieve()

        

    }
    
///******************************** RESTOREDATA *********************************************

    static restoreData = async ( e, data) => {
        e.preventDefault()
        

        const main = document.querySelector('main')
        main.innerHTML=`<div class="flex flex-col items-center" role="status">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                        </div>`

        for await (let item of data ){
            delete item._id

            const result = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            }) ?? {ok: false}
            
            if (!result.ok) {
                console.log(`Problemas recuperando a ${item.name}`) 
            }
        }

        Toast.info({message:'Recuperacion terminada', mode: 'success'})
        main.innerHTML = `<div class="bg-blue-500" role="alert">
                                Se mantendrá un réplica de los registros de unicornios en el LocalStorage
                        </div>`
    }

///************************** RESTORATIONOPTIONS *************************************    


    static restorationOptions = async (result) => {
        let existsInLocalStorage = false
        let existsInJSONFile = false
        let unicornsJSON = await result.json()
        

        // si no hay registros de unicornios en el backend
        if (unicornsJSON.length === 0) {
            // verificar si hay registros en el localStorage
            let unicornsLocal = localStorage.getItem('tablaData')
            if (unicornsLocal) {
                unicornsLocal = JSON.parse(unicornsLocal)
                if (unicornsLocal.length > 0) {
                    existsInLocalStorage = true
                }
            }

            // verificar si hay registros en un archivo JSON
            result = await fetch('./data/unicorns.json') ?? { ok: false }
            if (result.ok) {
                unicornsJSON = await result.json()
                if (unicornsJSON.length > 0) {
                    existsInJSONFile = true
                }
            }

            if (existsInJSONFile || existsInLocalStorage) {
                let message
                const main = document.querySelector('main')
                message = 'No hay registros pero los puede recuperar del '
                if (existsInJSONFile && existsInLocalStorage) {
                    message += `archivo <a class="text-blue-500" id="restore-from-json" href=""> ./data/unicorns.json</a> o del 
                    <a id="restore-from-lstorage" href="" class="text-blue-500"> LocalStorage</a>`
                    main.innerHTML = `<div class="bg-red-500"
                                    role="alert">${message}</div>`
                    document.querySelector('#restore-from-json')
                    .addEventListener(
                        'click', e => this.restoreData(e, unicornsJSON)
                        )
                    document.querySelector('#restore-from-lstorage')
                    .addEventListener(
                        'click', e => this.restoreData(e, unicornsLocal)
                        )
                } else if (existsInJSONFile) {
                    message += `<a id="restore-from-json" href="">
                                archivo ./data/unicorns.json</a>`
                    main.innerHTML = `<div class="bg-red-500"
                                    role="alert">${message}</div>`
                    document.querySelector('#restore-from-json')
                    .addEventListener(
                        'click', e =>{
                            this.restoreData(e, unicornsJSON)
                        } 
                        )
                } else {
                    message += `<a id="restore-from-lstorage"
                                href="">LocalStorage</a>`
                    main.innerHTML = `<div class="bg-red-500"
                                        role="alert">${message}</div>`
                    document.querySelector('#restore-from-lstorage')
                    .addEventListener(
                        'click', e => this.restoreData(e, unicornsLocal)
                        )
                }
            } else {
                document.querySelector('main').innerHTML = `
                    <div class="bg-red-500" role="alert">
                        No se encontró información de unicornios en el
                        LocalStorage ni en ./data/unicorns.json
                        lo que permitiría poblar la base de datos desde dichos
                        repositorios.
                    </div>`
            }
        } else {
            
            Toast.info({message: 'Todo listo para hacer pruebas Rest'})
            document.querySelector('main').innerHTML = `
                <div class="bg-blue-500" role="alert">
                    Se mantendrá un réplica de los registros de unicornios en
                    el LocalStorage
                </div>`
        }
    }


}
