// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { fetchData() });
// items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer productos
const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
    // console.log(data)
    pintarCarrito();

}

var db = new Dexie("compra");
db.version(1).stores({
    producto: `
    id,
    titulo,
    precio,
    cantidad,
    imagen`,
    inscripciones: `
    ++id,
    nombres,
    apellidos,
    fecha_nac,
    ci,
    ciudad,
    direccion,
    estatura,
    peso,
    fecha_inscripcion`,
    venta:`
    ++id,
    cantidad,
    precio,
    nombre,
    direccion,
    ciudad,
    fecha`
});


const pintarCarrito = () => {
    var cant_total=0;
    var preciototal=0;
    db.producto.each(item => {
        cant_total=cant_total+item.cantidad;
        preciototal=preciototal+parseFloat(item.precio) * item.cantidad;
        document.getElementById("cart_quantity").textContent=cant_total;
        document.getElementById("monto_total").textContent=" Carrito Bs. "+preciototal;
    });
}

const obtener = (clave) =>{
    const trasaccion = db.transaction(['compra'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('compra')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = (e) =>{
        console.log(conexion.result)
    }

}