// const cards = document.getElementById('cards')
const items = document.getElementById('carrito')
const footer = document.getElementById('monto_total')
// const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { fetchData() });
items.addEventListener('click', e => { addCarrito(e) });
// items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer productos
const fetchData = async () => {
    const data = await db.producto.toArray();
    pintarCards(data);
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

// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
        var fila='<tr><td class="cart_product_img d-flex align-items-center"><img src="'+producto.imagen+'" alt="Product" id="imagen_"><h6>'+producto.title+'</h6></td><td class="price"><span>Bs '+producto.precio+'</span></td><td class="qty"><div class="quantity"><span class="qty-minus" onclick=""><i class="fa fa-minus" aria-hidden="true"></i></span><input type="number" class="qty-text" id="qty" step="1" min="1" max="99" name="quantity" value="'+producto.cantidad+'"><span class="qty-plus" onclick=""><i class="fa fa-plus" aria-hidden="true"></i></span></div></td><td class="total_price"><span>BS '+parseFloat(producto.precio)*producto.cantidad+'</span></td></tr>'
        items.innerHTML += fila

    })
    console.log(items);
}

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        // console.log(e.target.dataset.id)
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    var idprod=item.querySelector('a').dataset.id;

    db.transaction('rw', db.producto, async ()=>{
        const producto_ = await db.producto.get({id: idprod});
        if(typeof producto_ !== "undefined")
        {
            ++producto_.cantidad;
            await db.producto.put(producto_);
            Notiflix.Notify.info('Cantidad de producto <b>'+producto_.title+'</b> incrementada en el carrito de compras');
        }else{
            db.producto.add(
            { id: item.querySelector('a').dataset.id, title: item.querySelector('h5').textContent, precio: item.querySelector('h3').textContent, cantidad: 1, imagen: item.querySelector('input').value},
            );
            Notiflix.Notify.success('Producto <b>'+item.querySelector('h5').textContent+'</b> agregado al carrito de compras');
            console.log(producto_)
        }
    }).then(() => {
        pintarCarrito();

    }).catch(err => {
        console.error(err.stack);
    });
}

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

// const pintarCarrito = () => {
//     items.innerHTML = ''

//     Object.values(carrito).forEach(producto => {
//         templateCarrito.querySelector('th').textContent = producto.id
//         templateCarrito.querySelectorAll('td')[0].textContent = producto.title
//         templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
//         templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

//         //botones
//         templateCarrito.querySelector('.btn-info').dataset.id = producto.id
//         templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

//         const clone = templateCarrito.cloneNode(true)
//         fragment.appendChild(clone)
//     })
//     items.appendChild(fragment)

//     pintarFooter()
// }

// const pintarFooter = () => {
//     footer.innerHTML = ''

//     if (Object.keys(carrito).length === 0) {
//         footer.innerHTML = `
//         <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
//         `
//         return
//     }

//     // sumar cantidad y sumar totales
//     const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
//     const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
//     // console.log(nPrecio)

//     templateFooter.querySelectorAll('td')[0].textContent = nCantidad
//     templateFooter.querySelector('span').textContent = nPrecio

//     const clone = templateFooter.cloneNode(true)
//     fragment.appendChild(clone)

//     footer.appendChild(fragment)

//     const boton = document.querySelector('#vaciar-carrito')
//     boton.addEventListener('click', () => {
//         carrito = {}
//         pintarCarrito()
//     })

// }

// const btnAumentarDisminuir = e => {
//     // console.log(e.target.classList.contains('btn-info'))
//     if (e.target.classList.contains('btn-info')) {
//         const producto = carrito[e.target.dataset.id]
//         producto.cantidad++
//         carrito[e.target.dataset.id] = { ...producto }
//         pintarCarrito()
//     }

//     if (e.target.classList.contains('btn-danger')) {
//         const producto = carrito[e.target.dataset.id]
//         producto.cantidad--
//         if (producto.cantidad === 0) {
//             delete carrito[e.target.dataset.id]
//         } else {
//             carrito[e.target.dataset.id] = {...producto}
//         }
//         pintarCarrito()
//     }
//     e.stopPropagation()
// }
