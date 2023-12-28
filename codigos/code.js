var ahorroGuardado = parseFloat(localStorage.getItem('ahorro')) || 0;

var totalTodo = parseFloat(localStorage.getItem('totalTodo')) || 0;
totalTodo += ahorroGuardado;

var productosList = JSON.parse(localStorage.getItem('productosList')) || [];

function productos() {
    var img = document.getElementById('img').value;
    var nombre = document.getElementById('nombre').value.toUpperCase();
    var cantidad = document.getElementById('cantidad').value;
    var precio = document.getElementById('precio').value;
    var cont = document.getElementById('contenido-flotante');

    if (productoYaExiste(nombre)) {
        cont.innerHTML = `
            <div class="contenido-flotante" id="inf">
                <h2 onclick="quitarFlotante()">X</h2>
                <h1>⚠️<br>El producto ya existe. Por favor, ingrese uno nuevo.</h1>
            </div>
        `;
        var inf = document.getElementById('inf');
        inf.style.height = "100";
        inf.style.width = "200";
        inf.style.textAlign = "center";
        inf.style.justifyContent = "center";
        return;
    }

    var producto = {
        img: img,
        nombre: nombre,
        cantidad: cantidad,
        precio: precio
    };

    productosList.push(producto);

    actualizarLocalStorage();

    limpiarCampos();
}

function productoYaExiste(nombre) {
    for (var i = 0; i < productosList.length; i++) {
        if (productosList[i].nombre === nombre) {
            return true;
        }
    }
    return false;
}

// Funciones relacionadas con la visualización de productos
function mostrarProductos() {
    var cont = document.getElementById('contenido');
    cont.innerHTML = "";

    for (var i = 0; i < productosList.length; i++) {
        var producto = productosList[i];

        cont.innerHTML += `
            <div class="item">
                <img src="${producto.img}" alt="">
                <h2>${producto.nombre}</h2>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Precio: $ ${producto.precio}</p>
                <button class="eliminar" onclick="eliminarProducto(${i})">🗑️</button>
            </div>
        `;
    }

    cont.style.display = "grid";
    cont.style.gridTemplateColumns = "100px 100px 100px";
    cont.style.justifyContent = "center";
    cont.style.alignItems = "center";
    cont.style.gridColumnGap = "5%";
    cont.style.margin = "5";
}

function eliminarProducto(index) {

    productosList.splice(index, 1);

    productoMuestra();

    actualizarLocalStorage();
}

// Funciones relacionadas con la búsqueda de productos
function flotante(producto) {
    var cont = document.getElementById('contenido-flotante');
    cont.innerHTML = `
        <div class="contenido-flotante">
            <h2 onclick="quitarFlotante()">X</h2>
            <h1>PRODUCTO ENCONTRADO</h1>
            <div class="item">
                <img src="${producto.img}" alt="">
                <h2>${producto.nombre}</h2>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Precio: $ ${producto.precio}</p>
            </div>
        </div>
    `;
}

function quitarFlotante() {
    var cont = document.getElementById('contenido-flotante');
    cont.innerHTML = ` `;
}

function buscar() {
    var productoBuscar = document.getElementById('productoBuscar').value;
    var encontrado = false;

    for (var i = 0; i < productosList.length; i++) {
        var producto = productosList[i];

        if (producto.nombre.toLowerCase() === productoBuscar.toLowerCase()) {
            flotante(producto);
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        alert('Producto no encontrado');
    }
}

function consulta() {
    var cont = document.getElementById('contenido');

    cont.innerHTML = `
        <h1>BUSCAR PRODUCTO</h1>
        <input type="text" placeholder="NOMBRE DEL PRODUCTO" id="productoBuscar">
        <button id="buscar" onclick="buscar()">BUSCAR</button>
    `;
    cont.style.display = "flex";
    cont.style.flexDirection = "column";
    cont.style.justifyContent = "center";
    cont.style.alignItems = "center";
}

// Funciones relacionadas con la venta de productos
function vender() {
    var cont = document.getElementById('contenido');

    cont.innerHTML = `
        <h1>VENDER PRODUCTO</h1>
        <input type="text" placeholder="NOMBRE DEL PRODUCTO" id="nombreVender">
        <input type="number" placeholder="CANTIDAD DEL PRODUCTO" id="cantidadVender">
        <button onclick="realizarVenta()">VENDER</button>
    `;
    cont.style.display = "flex";
    cont.style.flexDirection = "column";
    cont.style.justifyContent = "center";
    cont.style.alignItems = "center";
}

// Función para realizar la venta
function realizarVenta() {
    var nombreProducto = document.getElementById('nombreVender').value;
    var cantidadVenta = parseInt(document.getElementById('cantidadVender').value);
    var cont = document.getElementById('contenido-flotante');

    for (var i = 0; i < productosList.length; i++) {
        var producto = productosList[i];

        if (producto.nombre.toLowerCase() === nombreProducto.toLowerCase()) {
            if (cantidadVenta > 0 && cantidadVenta <= producto.cantidad) {
                producto.cantidad -= cantidadVenta;
                var total = (cantidadVenta * producto.precio);
                total.toFixed(2);

                totalTodo += total;
                ahorro(totalTodo);
                notificaciones(producto, total, cantidadVenta);
            } else {
                cont.innerHTML = `
                    <div class="contenido-flotante">
                        <h2 onclick="quitarFlotante()">X</h2>
                        <h1>⚠️Cantidad no válida o insuficiente stock para la venta.⚠️</h1>
                        <div class="item">
                            <img src="${producto.img}" alt="">
                            <h4>Producto: ${producto.nombre}</h4>
                            <p>Cantidad solicitada:<br>${cantidadVenta}</p>
                            <br>
                            <p>Cantidad disponible:<br>${producto.cantidad}</p>
                        </div>
                    </div>
                `;
            }
            break;
        }
    }

    actualizarLocalStorage();
}

function ahorro(totalTodo) {
    var cont = document.getElementById('cabeza');
    var totalRedondeado = totalTodo.toFixed(2);
    cont.innerHTML = `
        <h1 class="titulo">CYBDAN</h1>
        <p id="ahorro">Ganancia Actual: $ ${totalRedondeado}</p>
    `;
}

function agregar() {
    var cont = document.getElementById('contenido');

    cont.innerHTML = `
        <h1>AGREGAR PRODUCTO</h1>
        <input type="text" placeholder="LINK IMAGEN DEL PRODUCTO" id="img">
        <input type="text" placeholder="NOMBRE DEL PRODUCTO" id="nombre">
        <input type="number" placeholder="CANTIDAD DEL PRODUCTO" id="cantidad">
        <input type="number" placeholder="PRECIO DEL PRODUCTO" id="precio">
        <p id="msg">-</p>
        <button onclick="productos()">AGREGAR</button>
    `;
    cont.style.display = "flex";
    cont.style.flexDirection = "column";
    cont.style.justifyContent = "center";
    cont.style.alignItems = "center";
}

function productoMuestra() {
    var cont = document.getElementById('contenido');
    cont.innerHTML = "";

    for (var i = 0; i < productosList.length; i++) {
        var producto = productosList[i];

        cont.innerHTML += `
            <div class="item">
                <img src="${producto.img}" alt="">
                <h2>${producto.nombre}</h2>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Precio: $ ${producto.precio}</p>
                <button class="eliminar" onclick="eliminarProducto(${i})">🗑️</button>
            </div>
        `;
    }
    cont.style.display = "grid";
    cont.style.gridTemplateColumns = "100px 100px 100px";
    cont.style.justifyContent = "center";
    cont.style.alignItems = "center";
    cont.style.gridColumnGap = "20%";
}

function notificaciones(producto, total, cantidadVenta) {
    var cont = document.getElementById('contenido-flotante');
    cont.innerHTML = `
        <div class="contenido-flotante">
            <h2 onclick="quitarFlotante()">X</h2>
            <h1>VENTA REALIZADA CON ÉXITO ✔️</h1>
            <div class="item">
                <img src="${producto.img}" alt="">
                <h4>Producto vendido: ${producto.nombre}</h4>
                <p>Cantidad vendida: ${cantidadVenta}</p>
                <p>Precio unitario: ${producto.precio}</p>
                <p>Total: $ ${total}</p>
            </div>
        </div>
    `;
}

// Función para limpiar los campos de entrada
function limpiarCampos() {
    document.getElementById('img').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precio').value = '';
}

// Función para actualizar el localStorage
function actualizarLocalStorage() {
    localStorage.setItem('productosList', JSON.stringify(productosList));
    localStorage.setItem('totalTodo', totalTodo.toString());

    var ahorroElement = document.getElementById('ahorro');
    if (ahorroElement) {
        var ahorroValor = ahorroElement.innerText.replace('$ ', '');
        localStorage.setItem('ahorro', ahorroValor);
    }
}

window.onload = productoMuestra();
