const formulario = document.getElementById('formulario')
const nombreInput = document.getElementById('nombRegistro')
const dniInput = document.getElementById('dniRegistro')
const carreraInput = document.getElementById('carreraRegistro')
const crearRegistro = document.querySelector('.crearRegistro')
//tabla
const tabla = document.getElementsByTagName("td")
const tablaResultados = document.getElementById('tablaResultados')
const templateTabla = document.getElementById('templateTabla')
const fragment = document.createDocumentFragment()
const nombreTemplate = document.getElementById('nombreTemplate')
const dniTemplate = document.getElementById('dniTemplate')
const carreraTemplate = document.getElementById('carreraTemplate')

personaArreglo = []
PersonaLocalStorage = []
editando = true
let id = 0

document.addEventListener('DOMContentLoaded', e => {
    editando = false
    personaArreglo = JSON.parse(localStorage.getItem("persona")) || []
    pintarTabla(personaArreglo)

})

document.addEventListener('click', e => {

    if (e.target.matches('.btn-outline-primary')) {
        editar(e)
    };

    if (e.target.matches('.btn-outline-danger')) {
        eliminar(e)
    };

})


formulario.addEventListener('submit', (e) => {

    e.preventDefault()
    persona = {
        nombre: nombreInput.value,
        dni: dniInput.value,
        carrera: carreraInput.value,
        id: `${Date.now()}`
    }

    if (editando === false) {
        personaArreglo.push(persona)
        agregarInfoATabla()
        formulario.reset()
    }

    if (editando === true) {
        actualizar(id)
        crearRegistro.textContent = "Crear";
        editando = false
    }
})


const agregarInfoATabla = () => {

    tablaResultados.textContent = ''

    localStorage.setItem("persona", JSON.stringify(personaArreglo))

    PersonaLocalStorage = JSON.parse(localStorage.getItem("persona"))

    pintarTabla(PersonaLocalStorage)
    editando = false
}


function pintarTabla(PersonaLocalStorage) {
    tablaResultados.textContent = ''
    PersonaLocalStorage.forEach(item => {

        const clone = templateTabla.content.cloneNode(true)
        clone.getElementById('nombreTemplate').textContent = item.nombre;
        clone.getElementById('dniTemplate').textContent = item.dni;
        clone.getElementById('carreraTemplate').textContent = item.carrera;
        clone.querySelector('.btn-outline-primary').dataset.id = item.id
        clone.querySelector('.btn-outline-danger').dataset.id = item.id
        fragment.appendChild(clone)

    });

    tablaResultados.appendChild(fragment)
}

function actualizar(id) {

    personaArreglo = personaArreglo.map(item => {
        if (item.id === id) {

            item.nombre = nombreInput.value
            item.dni = dniInput.value
            item.carrera = carreraInput.value
        }

        return item
    })
    localStorage.setItem("persona", JSON.stringify(personaArreglo))

    pintarTabla(personaArreglo)

    formulario.reset()

    editando = false

}

function editar(e) {

    editando = true

    const indice = personaArreglo.findIndex(item => item.id === e.target.dataset.id)

    nombreInput.value = personaArreglo[indice].nombre
    dniInput.value = personaArreglo[indice].dni
    carreraInput.value = personaArreglo[indice].carrera
    id = `${e.target.dataset.id}`

    crearRegistro.textContent = "Editar";

}


function eliminar(e) {

    personaArreglo = personaArreglo.filter(item => item.id !== e.target.dataset.id)
    localStorage.setItem("persona", JSON.stringify(personaArreglo))

    pintarTabla(personaArreglo)

}


