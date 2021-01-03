import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import PedidoContext from '../../context/pedidos/PedidoContext'

const Total = props => {
  const pedidoContext = useContext(PedidoContext)
  const {total} = pedidoContext

  return (
    <div
      className='
      flex
      items-center
      mt-5
      justify-between
      bg-white
      p-3'>
      <h2 className='text-gray-800 text-lg'>Total a pagar: </h2>
      <p className='text-gray-800 mt-0'>$ {total}</p>
    </div>
  )
}

Total.propTypes = {}

export default Total
