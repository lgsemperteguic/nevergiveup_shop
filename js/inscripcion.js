const formulario = document.getElementById('form_enroll')

let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { fetchData() });
formulario.addEventListener('click', e => { addCarrito(e) });

const fetchData = async () => {
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

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('karl-checkout-btn')) {
        setInscripcion(e.target.parentElement)
    }
    e.stopPropagation()
}

const setInscripcion = item => {
    var idusr=document.getElementById('cedula').value;
    db.transaction('rw', db.inscripciones, async ()=>{
        const inscripcion = await db.inscripciones.get({ci: idusr});
        if(idusr!=""){
            if(typeof inscripcion !== "undefined")
            {
                Notiflix.Notify.warning('El usuario '+inscripcion.nombres+' '+inscripcion.apellidos+'ya se encuentra inscrito');
            }else{
                var nombre=document.getElementById('first_name').value
                var apellido=document.getElementById('last_name').value
                var fecha_nac=document.getElementById('fechanac').value
                var ci=document.getElementById('cedula').value
                var ciudad=document.getElementById('ciudad').value
                var direccion=document.getElementById('street_address').value
                var estatura=document.getElementById('estatura').value
                var peso=document.getElementById('peso').value
                var today=new Date()
                db.inscripciones.add(
                {
                nombres: nombre,
                apellidos: apellido,
                fecha_nac: fecha_nac,
                ci: ci,
                ciudad: ciudad,
                direccion: direccion,
                estatura: estatura,
                peso: peso,
                fecha_inscripcion: today},
                );
                console.log(inscripcion)
            }
        }
    }).then(() => {
        setCarrito(item);

    }).catch(err => {
        console.error(err.stack);
    });

}

const setCarrito = item => {
    var idusr=document.getElementById('cedula').value;
    var idprod=item.querySelector('a').dataset.id;
    db.transaction('rw', db.producto, async ()=>{
        const producto_ = await db.producto.get({id: idprod});
        if(typeof producto_ !== "undefined" && idusr!="")
        {
            ++producto_.cantidad;
            await db.producto.put(producto_);
            Notiflix.Notify.info('Nueva Incripción registrada e incrementada en el carrito de compras');
        }else if(idusr!=""){
            var nombre=document.getElementById('first_name').value
            var apellido=document.getElementById('last_name').value
            db.producto.add(
            { id: item.querySelector('a').dataset.id, title: 'Incripción Mensual', precio: 220, cantidad: 1, imagen: 'img/suplementos/producto1.png'},
            );
            Notiflix.Notify.success('Inscripción registrada y agregado al carrito de compras con éxito');
            console.log(producto_)
        }else{
            Notiflix.Notify.failure('Formulario sin llenar');
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
