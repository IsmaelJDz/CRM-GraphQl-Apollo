import React, {useContext, useState} from 'react'
import Layout from '../components/Layout'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProductos from '../components/pedidos/AsignarProductos'
import ResumenPedido from '../components/pedidos/ResumenPedido'
import Total from '../components/pedidos/Total'
import PedidoContext from '../context/pedidos/PedidoContext'
import {useMutation} from '@apollo/client'
import {NUEVO_PEDIDO, OBTENER_PEDIDOS} from '../queries/querys'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'

const nuevopedido = () => {
  const router = useRouter()

  const [mensaje, setMensaje] = useState(null)

  const pedidoContext = useContext(PedidoContext)
  const {cliente, productos, total} = pedidoContext

  //Mutacion para crear un nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, {data: {nuevoPedido}}) {
      const {obtenerPedidosVendedor} = cache.readQuery({
        query: OBTENER_PEDIDOS,
      })

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      })
    },
  })

  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? ' opacity-50 cursor-not-allowed '
      : ''
  }

  const crearNuevoPedido = async () => {
    const {id} = cliente
    //remover lo no deseado de productos
    const pedido = productos.map(
      ({__typename, existencia, ...producto}) => producto
    )

    try {
      const {data} = await nuevoPedido({
        variables: {
          input: {
            pedido,
            total,
            cliente: id,
          },
        },
      })
      //redirecionar
      router.push('/pedidos')

      //Mostrar alerta
      Swal.fire('Correcto', 'El pedido se registró correctamente!', 'success')
    } catch (error) {
      console.log(error)
      setMensaje(error.message.replace('GraphQL error:', ''))

      setTimeout(() => {
        setMensaje(null)
      }, 2000)
    }
  }

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p> {mensaje} </p>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Crear nuevo Pedido</h1>

      {mensaje && mostrarMensaje()}

      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            onClick={() => crearNuevoPedido()}
            type='button'
            className={`
              bg-gray-800
              w-full
              mt-5 p-2
              text-white
              uppercase
              font-bold
              hover:bg-gray-900 ${validarPedido()}`}>
            Registrar pedido
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default nuevopedido
