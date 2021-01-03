import React, {useEffect} from 'react'
import Layout from '../components/Layout'
import {useQuery, gql} from '@apollo/client'
import {useRouter} from 'next/router'
import Link from 'next/link'

import Cliente from '../components/Cliente'
import {OBTENER_CLIENTES_USUARIO} from '../queries/querys'

export default function Index() {
  const router = useRouter()

  //Consulta de apollo
  const {data, loading, error, refetch, startPolling, stopPolling} = useQuery(
    OBTENER_CLIENTES_USUARIO
  )

  useEffect(() => {
    startPolling(1000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  setTimeout(() => {
    refetch()
  }, 10)

  if (loading) {
    refetch()
    return <p>Loading...</p>
  }

  if (!data.obtenerClientesVendedor) {
    router.push('/login')
    return <p>Loading...</p>
  }

  // if (!data.obtenerClientesVendedor) {
  //   return router.push('/login')
  // }

  // // Si no hay información, reenviar al login
  // if (!data.obtenerClientesVendedor) {
  //   return <RedirectLogin />
  // }

  // function RedirectLogin() {
  //   React.useEffect(() => {
  //     return router.push('/login')
  //   }, [])

  //   return (
  //     <>
  //       <p>Cargando... </p>
  //     </>
  //   )
  // }

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>
        <Link href='/nuevocliente'>
          <a
            className='bg-blue-800
            py-2
            px-5
            mt-5
            inline-block
            text-white
            rounded
            text-sm
            hover:bg-gray-800
            mb-3
            uppercase
            font-bold
            w-full
            lg:w-auto
            text-center
            '>
            Nuevo cliente
          </a>
        </Link>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Nombre</th>
                <th className='w-1/5 py-2'>Empresa</th>
                <th className='w-1/5 py-2'>Email</th>
                <th className='w-1/5 py-2'>Editar</th>
                <th className='w-1/5 py-2'>Eliminar</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              <Cliente datas={data} />
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  )
}
