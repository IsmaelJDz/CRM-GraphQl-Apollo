import React, {useState} from 'react'
import Swal from 'sweetalert2'
import {useMutation, gql} from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`

const Cliente = ({datas}) => {
  //Mutation para eliminar cliente
  const [Id, setId] = useState(null)

  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //obtener una copia del objeto de cache
      const {obtenerClientesVendedor} = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      })
      //Reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            clienteActual => clienteActual.id !== Id
          ),
        },
      })
    },
  })

  const confirmarEliminarCliente = id => {
    Swal.fire({
      title: '¿Deseas eliminar a este cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then(async result => {
      if (result.value) {
        try {
          // Eliminar por ID
          setId(id)
          const {data} = await eliminarCliente({
            variables: {
              id,
            },
          })

          // Mostrar una alerta: data.eliminarCliente es el resultado de la consulta en el query de GraphQl
          Swal.fire('Eliminado!', data.eliminarCliente, 'success')
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  const editarCliente = id => {
    Router.push({
      pathname: '/editarcliente/[id]',
      query: {id},
    })
  }

  return (
    <>
      {datas.obtenerClientesVendedor.map(client => (
        <tr key={client.id}>
          <td className='border px-4 py-2'>
            {client.nombre} {client.apellido}
          </td>
          <td className='border px-4 py-2'>{client.empresa}</td>
          <td className='border px-4 py-2'>{client.email}</td>
          <td className='border px-4 py-2'>
            <button
              onClick={() => editarCliente(client.id)}
              type='button'
              className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'>
              Editar
              <svg
                className='w-6 h-6 ml-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'></path>
              </svg>
            </button>
          </td>
          <td className='border px-4 py-2'>
            <button
              onClick={() => confirmarEliminarCliente(client.id)}
              type='button'
              className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'>
              Eliminar
              <svg
                className='w-6 h-6 ml-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
              </svg>
            </button>
          </td>
        </tr>
      ))}
    </>
  )
}

export default Cliente
