import React, {useEffect, useState, useContext} from 'react'
import Select from 'react-select'
import {useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext'

import {OBTENER_CLIENTES_USUARIO} from '../../queries/querys'

const AsignarCliente = () => {
  const [cliente, setClientes] = useState([])

  const pedidoContext = useContext(PedidoContext)
  const {agregarCliente} = pedidoContext

  //consultar la base de datos
  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO)

  useEffect(() => {
    agregarCliente(cliente)
  }, [cliente])

  const seleccionarCliente = clientes => {
    setClientes(clientes)
  }

  if (loading) return 'Cargando...'
  const {obtenerClientesVendedor} = data

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        1.- Asigna un cliente al pedido
      </p>
      <Select
        className='mt-3'
        options={obtenerClientesVendedor}
        onChange={opcion => seleccionarCliente(opcion)}
        getOptionValue={opcion => opcion.id}
        getOptionLabel={opcion => opcion.nombre}
        placeholder='Seleccione el cliente'
        noOptionsMessage={() => 'No hay resultados'}
      />
    </>
  )
}

export default AsignarCliente
