import React, {useEffect, useState, useContext} from 'react'
import Select from 'react-select'
import {useQuery} from '@apollo/client'
import {OBTENER_PRODUCTOS} from '../../queries/querys'
import PedidoContext from '../../context/pedidos/PedidoContext'

const AsignarProductos = () => {
  const pedidoContext = useContext(PedidoContext)
  const {agregarProducto} = pedidoContext

  //local state
  const [productos, setProductos] = useState([])

  //Consulta a la base de datos
  const {data, loading, error} = useQuery(OBTENER_PRODUCTOS)

  useEffect(() => {
    //TODO : function para pasar al pedidoState
    agregarProducto(productos)
  }, [productos])

  if (loading) return 'Loading ...'
  const {obtenerProductos} = data

  const seleccionarProducto = producto => {
    setProductos(producto)
  }

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        2.- Selecciona o busca los productos
      </p>
      <Select
        className='mt-3'
        isMulti
        options={obtenerProductos}
        onChange={opcion => seleccionarProducto(opcion)}
        getOptionValue={opcion => opcion.id}
        getOptionLabel={opcion =>
          `${opcion.nombre} - ${opcion.existencia} Disponibles`
        }
        placeholder='Busque o seleccione el producto'
        noOptionsMessage={() => 'No hay resultados'}
      />
    </>
  )
}

export default AsignarProductos
