// const cards = document.getElementById('cards')
const items = document.getElementById('productos')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
// const templateFooter = document.getElementById('template-footer').content
// const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { fetchData() });
items.addEventListener('click', e => { addCarrito(e) });
// items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer productos
const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
    // console.log(data)
    pintarCards(data)
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
    data.forEach(item => {
        templateCard.querySelector('div#divproducto').className="col-12 col-sm-6 col-md-4 single_gallery_item wow fadeInUpBig "+item.type
        templateCard.querySelector('h4#titulo').textContent = item.title
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('img').setAttribute("src",item.thumbnailUrl)
        templateCard.querySelector('input').setAttribute("value",item.thumbnailUrl)
        templateCard.querySelector('h4#precio').textContent ="Bs. "+item.precio
        templateCard.querySelector('h3').textContent =item.precio
        templateCard.querySelector('p').textContent = item.description
        templateCard.querySelector('a').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
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
    // const producto = {
    //     precio: item.querySelector('h3').textContent,
    //     title: item.querySelector('h5').textContent,
    //     id: item.querySelector('a').dataset.id,
    //     cantidad: 1
    // }
    var idprod=item.querySelector('a').dataset.id;
    // const transaction = db.transaction(["producto"], "readonly");
    // const objectStore = transaction.objectStore("producto");
    // var req = objectStore.openCursor(idprod);
    // req.onsuccess = function(e) {
    // var cursor = e.target.result;
    //     if (cursor) { // key already exist
    //         cursor.update({cantidad: cursor.cantidad+1});
    //         Notiflix.Notify.success('Cantidad de producto <b>'+cursor.title+'</b> incrementada en el carrito de compras');

    //     } else { // key not exist

    //     }
    // };
    // const trasaccion = db.transaction(['compra'],'readonly')
    // const coleccionObjetos = trasaccion.objectStore('compra')
    // const conexion = coleccionObjetos.get(idprod)

    // conexion.onsuccess = (e) =>{
    //     console.log(conexion.result)
    // }
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

        //
        // Transaction Failed
        //

        console.error(err.stack);
    });


    // const request = db.transaction("rw",db.producto).objectStore("compra").get(idprod);

    // request.onsuccess = (event) => {
    //     console.log(request);
    // };
    // request.onerror = (event) => {
    //     // db.producto.add(
    //     //     { id: item.querySelector('a').dataset.id, title: item.querySelector('h5').textContent, precio: item.querySelector('h3').textContent, cantidad: 1},
    //     // );
    //     // Notiflix.Notify.success('Producto <b>'+item.querySelector('h5').textContent+'</b> agregado al carrito de compras');
    //     console.log("error");
    // };


    // console.log(producto)
    // if (carrito.hasOwnProperty(producto.id)) {
    //     producto.cantidad = carrito[producto.id].cantidad + 1
    // }

    // carrito[producto.id] = { ...producto }
    // console.log(carrito);
    // pintarCarrito()
}

const pintarCarrito = () => {
    var cant_total=0;
    var preciototal=0;
    db.producto.each(item => {
        cant_total=cant_total+item.cantidad;
        preciototal=preciototal+parseFloat(item.precio) * item.cantidad;
        console.log("cantidad "+cant_total)
        console.log("precio "+preciototal)
        // templateCarrito.querySelector('li').setAttribute("id",item.id)
        // templateCarrito.querySelector('img').setAttribute("src",item.imagen)
        // templateCarrito.querySelectorAll('span.cantidad').textContent = item.cantidad
        // templateCarrito.querySelectorAll('a').textContent = item.title
        // templateCarrito.querySelector('span.price').textContent = item.precio * item.cantidad
        // templateCarrito.querySelector('span').textContent = item.title
        // const clone = templateCarrito.cloneNode(true)
        // var li = document.createElement("li");
        // texto='<a href="#" class="image"><img src="'+item.imagen+'" class="cart-thumb" alt=""></a><div class="cart-item-desc"><h6><a href="#">'+item.title+'</a></h6><p><span class="cantidad">'+item-cantidad+'x</span> - <span class="price">Bs '+item.cantidad*item.precio+'</span></p></div>'
        // li.appendChild(document.createTextNode(texto));
        // li.setAttribute("id", item.id);
        // productoscar.appendChild(li)
        document.getElementById("cart_quantity").textContent=cant_total;
        document.getElementById("monto_total").textContent=" Carrito Bs. "+preciototal;
    });

    // productoscar.appendChild(fragment)
    console.log(cant_total)
    console.log(preciototal)
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
