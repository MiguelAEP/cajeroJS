//form cajero
const formularioCajero = document.getElementById('formularioCajero')
const numeroCuentaCajero = document.getElementById('numCuenta')
const dniCuentaCajero = document.getElementById('dniCajero')
const montoCuenta = document.getElementById('montoCuenta')
const mensajeErrorCajero = document.getElementById('mensajeErrorCajero')
const saldoTotal = document.getElementById('saldoTotal')
const templateCuentasRegistradas = document.getElementById('templateCuentasRegistradas')
const saveTemplateCuentas = document.getElementById('saveTemplateCuentas')
const mensajeDeposito = document.getElementById('mensajeDeposito')
const mensajeRetiro = document.getElementById('mensajeRetiro')

//form persona 

const formularioPersona = document.getElementById('formularioPersona')
const nombre = document.getElementById('nombrePersona')
const dni = document.getElementById('dniPersona')
const numeroCuenta = document.getElementById('numeroCuentaPersona')
const monto = document.getElementById('montoPersona')
const mensajeErrorPersona = document.getElementById('mensajeErrorPersona')
const templatePersona = document.getElementById('templateRegistroPersona')
const divRegistro = document.getElementById('personaRegistroTemplate')
const fragment = document.createDocumentFragment()

const regUserName = /^[A-Za-zÃ‘Ã±ÃÃ¡Ã‰Ã©ÃÃ­Ã“Ã³ÃšÃºÃœÃ¼\s]+$/;
let arregloPersona = []
let arregloCajero = []
let cuentasLocal = []


formularioPersona.addEventListener("submit", e => {
    e.preventDefault()
    const ui = new UI()
    if (!regUserName.test(nombre.value) || !nombre.value.trim() || dni.value.length > 8 || dni.value.length < 8 || monto.value <= 0) {
        ui.pintarMensajesAlerta(true, "error")
        return
    }
    ui.pintarMensajesAlerta(false, "noError")

    const persona = new Persona(nombre.value, dni.value, numeroCuenta.value, monto.value)
    arregloPersona.push(persona)
    ui.pintarMensajeRegistro(persona)

    localStorage.setItem("cuentas", JSON.stringify(arregloPersona))

    const cajero = new CajeroAutomatico()
    cajero.almacenaCliente(persona)

    numeroCuentaCajero.disabled = false
    dniCuentaCajero.disabled = false
    montoCuenta.disabled = false

    formularioPersona.reset()

})


document.addEventListener("click", e => {

    const cajero = new CajeroAutomatico()

    if (e.target.dataset.boton === "depositar") {
        cajero.depositar()

    }

    if (e.target.dataset.boton === "retirar") {
        cajero.retirar()
    }
    if (e.target.dataset.boton === "cuentas") {
        cajero.muestraClientes()
    }
})


class Persona {

    constructor(nombre, dni, numeroCuenta, montoInicial) {
        this.nombre = nombre,
            this.dni = dni
        this.numeroCuenta = numeroCuenta
        this.montoInicial = montoInicial
    }

    get getPersona() {
        return this.nombre
    }

    get getDni() {
        return this.dni
    }
}

class CajeroAutomatico {


    depositar() {
        const ui = new UI()
        let numeroCuen = numeroCuentaCajero.value
        let dniCuent = dniCuentaCajero.value
        let montoCuent = montoCuenta.value

        const indice = arregloCajero.findIndex(item => item.dni === dniCuent)
        console.log(indice);

        if (numeroCuen < 0 || dniCuent.length > 8 || dniCuent.length < 8 || montoCuent <= 0) {
            ui.pintarMensajesAlerta(true, "errorCajero")
            return
        }

        ui.pintarMensajesAlerta(false, "noErrorCajero")

        if (indice === -1) {
            console.log("no existe");
            return
        } else {
            if (montoCuent > 0) {

                arregloCajero[indice].montoInicial = parseInt(arregloCajero[indice].montoInicial) + parseInt(montoCuent)
                saldoTotal.value = arregloCajero[indice].montoInicial
            }
        }

        ui.pintarDepositoRealizado(montoCuent, numeroCuen)

        ui.resetFormulario(formularioCajero)


    }


    retirar() {
        console.log("retirando");
        const ui = new UI()
        let numeroCuenRe = numeroCuentaCajero.value
        let dniCuentRe = dniCuentaCajero.value
        let montoCuentRe = montoCuenta.value

        const indice = arregloCajero.findIndex(item => item.dni === dniCuentRe)


        if (numeroCuenRe < 0 || dniCuentRe.length > 8 || dniCuentRe.length < 8 || montoCuentRe <= 0) {
            ui.pintarMensajesAlerta(true, "errorCajero")
            return
        }

        ui.pintarMensajesAlerta(false, "noErrorCajero")

        if (indice === -1) {
            console.log(indice);
            console.log("no existe");
            return
        }

        if (indice !== -1 && parseInt(montoCuentRe) < parseInt(arregloCajero[indice].montoInicial) && parseInt(montoCuentRe) > 0) {

            arregloCajero[indice].montoInicial = (parseInt(arregloCajero[indice].montoInicial) - parseInt(montoCuentRe))
            saldoTotal.value = arregloCajero[indice].montoInicial
            
        }

        ui.pintarRetiroRealizado(montoCuentRe, numeroCuenRe)

        ui.resetFormulario(formularioCajero)
        console.log(montoCuentRe);
    }

    almacenaCliente(persona) {
        arregloCajero.push(persona);
    }

    muestraClientes() {
        saveTemplateCuentas.textContent = ''
        const ui = new UI()

        if(localStorage.getItem("cuentas")){
            cuentasLocal =JSON.parse(localStorage.getItem("cuentas")) 
            cuentasLocal.forEach(item => {
                ui.pintarCuentasCreadas(item)
            })  
        }
    }
}

class UI {

    pintarMensajesAlerta(existeError, mensaje) {

        if (existeError && mensaje === "error") {
            mensajeErrorPersona.classList.remove('d-none')
        }
        else if (!existeError && mensaje === "noError") {
            mensajeErrorPersona.classList.add('d-none')
        }

        else if (existeError && mensaje === "errorCajero") {
            mensajeErrorCajero.classList.remove('d-none')
            console.log("error");
        }
        else if (!existeError && mensaje === "noErrorCajero") {
            mensajeErrorCajero.classList.add('d-none')
            console.log("no error");
        }



    }

    pintarMensajeRegistro(persona) {
        divRegistro.textContent = ''
        divRegistro.classList.remove('d-none')
        const clone = templateRegistroPersona.content.cloneNode(true)
        clone.querySelector('h3').textContent = `Usuario Registrado : ${persona.getPersona} con dni : ${persona.getDni}`
        clone.querySelector('h3').className = "text-center p-3"
        fragment.appendChild(clone)
        divRegistro.appendChild(fragment)

        setTimeout(() => {
            divRegistro.classList.add('d-none')

        }, 1500);
    }

    pintarCuentasCreadas(cuentas) {
        console.log(cuentas.dni);
        console.log(saldoTotal.value);
        //  saveTemplateCuentas.textContent=''
        const clone = templateCuentasRegistradas.content.cloneNode(true)
        clone.querySelector('li').textContent = `Nombre ${cuentas.nombre} - Dni ${cuentas.dni} - 
            Numero de Cuenta ${cuentas.numeroCuenta} - Monto inicial de Apertura ${cuentas.montoInicial}`
        fragment.appendChild(clone)
        saveTemplateCuentas.appendChild(fragment)
        console.log(fragment);


    }

    resetFormulario(selector) {
        selector.reset()
    }

    pintarDepositoRealizado(montoIngresado, numeroCuentaIngresado) {
        mensajeDeposito.classList.remove('d-none')
        mensajeDeposito.textContent = `Se deposito la cantidad $${montoIngresado} al numero de cuenta ${numeroCuentaIngresado}`
        setTimeout(() => {
            mensajeDeposito.classList.add('d-none')
        }, 1500);
    }

    pintarRetiroRealizado(montoIngresadoR, numeroCuentaIngresadoR) {
        console.log(mensajeRetiro);
        mensajeRetiro.classList.remove('d-none')
        mensajeRetiro.textContent = `Se retiro la cantidad $${montoIngresadoR} al numero de cuenta ${numeroCuentaIngresadoR}`

        setTimeout(() => {
            mensajeRetiro.classList.add('d-none')
        }, 1500);
    }


}