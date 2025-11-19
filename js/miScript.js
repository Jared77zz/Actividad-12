class Alcancia {
    constructor(t, c) {
        this.tipo = t; // tipo de alcancia (ahorro o retiro)
        this.cantidad = c; // cantidad al retirar o ingresar
    }

    // Metodos
    calcularMovimiento() {
        if (this.tipo == "ahorro") {
            return this.cantidad;
        } else {
            return -this.cantidad;
        }
    }
}

document.getElementById('formaDepositar').addEventListener('submit', function (e) {
    e.preventDefault();

    const cantidad = parseFloat(document.getElementById('montoDeposito').value);
    const tipo = 'ahorro';

    const objetoAlcancia = new Alcancia(tipo, cantidad);

    guardarMovimiento(objetoAlcancia);
    mostrarMovimientos();
    mostrarTotalSaldo();
});

document.getElementById('formaRetirar').addEventListener('submit', function (e) {
    e.preventDefault();

    const cantidad = parseFloat(document.getElementById('cantidadRetiro').value); // obtiene la cantidad que el usuario escribe en el input y la convierte en numero
    const tipo = 'retiro'; //  Indica el tipo que movimiento que es

    if(cantidad <= 0){
        alert("Ingresa una cantidad que no sea negativa o igual a 0")
        return;
    }

    // Llama a la funcion que devuelve el saldo actual disponible en la alcancia
    const saldoActual = obtenerSaldoActual(); 

    // Verifica si la cantidad que se quiere retirar es mayor al saldo que se dispone
    if (cantidad > saldoActual) {
        alert("Saldo insuficiente."); // Mensaje si no alcanza el dinero
        return;
    }

    // Crea un nuevo objeto de la clase Alcancia con la informacion del movimiento
    const objetoAlcancia = new Alcancia(tipo, cantidad);

    // Llamada de las funciones
    guardarMovimiento(objetoAlcancia);
    mostrarMovimientos();
    mostrarTotalSaldo();
});

function guardarMovimiento(movimiento) {
    // Obtiene la lista de movimientos almacenados en localStorage
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimiento.id = movimientos.length + 1;

    movimientos.push(movimiento);
    // Guarda nuevamente todo el arreglo en localStorage convertido a JSON
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    alert("Movimiento guardado");
}

function mostrarMovimientos() {
    const lista = document.getElementById('listaMovimientos');
    
    // Recupera los movimientos guardados en localStorage
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || []; // Si no existe nada, se crea un arreglo vacio

    lista.innerHTML = "";

    movimientos.forEach(m => {
        lista.innerHTML += `
            <p><b>Número de movimiento:</b> ${m.id}</p>
            <p>Tipo: ${m.tipo}</p>
            <p>Cantidad: $${m.cantidad}</p>
            <hr>
        `;
    });
}

function obtenerSaldoActual() {
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    // variable que se ocupara para ir acumulando el saldo total
    let saldo = 0;

    movimientos.forEach(m => {
        // Crea un objeto Alcancia a partir del movimiento guardado
        const movimientoObj = new Alcancia(m.tipo, m.cantidad);
        // Usa el metodo calcularMovimiento() para obtener cuanto aporta o quita el movimiento
        saldo += movimientoObj.calcularMovimiento(); // sera positivo si es ahorro, pero si es negativo es retiro
    });


    return saldo;
}

function mostrarTotalSaldo() {
    // Llama a la funcion obtenerSaldoActual para obtener el saldo total
    const saldoTotal = obtenerSaldoActual();
    document.getElementById('saldo').innerHTML = `Saldo total: $${saldoTotal}`;
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarMovimientos();
    mostrarTotalSaldo();
});