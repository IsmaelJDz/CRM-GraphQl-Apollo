import React, {useState} from 'react'
import Layout from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useMutation, gql} from '@apollo/client'
import {useRouter} from 'next/router'

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
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

export default function Nuevocliente() {
  const router = useRouter()

  //Mensaje de alerta
  const [mensaje, setMensaje] = useState(null)

  //nuevoCliente es nuevoCliente del result de GralQL nuevoCliente
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
    update(
      cache,
      {
        data: {nuevoCliente},
      }
    ) {
      //Obtener el objeto de cache que deseamos actualizar, normalmente es la query
      // donde vienen los nuevos clientes
      const {obtenerClientesVendedor} = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      })
      //reescribir el cachde (El cache nunca se debe modificar)
      //se debe reescribir
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
        },
      })
    },
  })

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      empresa: '',
      email: '',
      telefono: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre del cliente es obligatorio'),
      apellido: Yup.string().required('El apellido del cliente es obligatorio'),
      empresa: Yup.string().required('La empresa del cliente es obligatorio'),
      email: Yup.string()
        .email('Email no válido')
        .required('El email del cliente es obligatorio'),
    }),
    onSubmit: async values => {
      try {
        const {nombre, apellido, empresa, email, telefono} = values

        const {data} = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        })
        router.push('/')
      } catch (error) {
        setMensaje(error.message.replace('GraphQL error: ', ''))

        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    },
  })

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p> {mensaje} </p>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo cliente</h1>

      {mensaje && mostrarMensaje()}

      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <form
            onSubmit={formik.handleSubmit}
            className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'>
            <div className='mb-4'>
              <label
                htmlFor='nombre'
                className='block text-gray-700 text-sm font-bold mb-2'>
                Nombre:
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='nombre'
                type='text'
                placeholder='Nombre usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='apellido'
                className='block text-gray-700 text-sm font-bold mb-2'>
                Apellido:
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='apellido'
                type='text'
                placeholder='Apellido usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='empresa'
                className='block text-gray-700 text-sm font-bold mb-2'>
                Empresa:
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='empresa'
                type='text'
                placeholder='Empresa cliente'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.empresa}
              />
            </div>
            {formik.touched.empresa && formik.errors.empresa ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.empresa}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-gray-700 text-sm font-bold mb-2'>
                Email:
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='text'
                placeholder='Email cliente'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='telefono'
                className='block text-gray-700 text-sm font-bold mb-2'>
                Telefono:
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='telefono'
                type='tel'
                placeholder='Telefono cliente'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
              />
            </div>
            {formik.touched.telefono && formik.errors.telefono ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.telefono}</p>
              </div>
            ) : null}
            <input
              type='submit'
              className='bg-gray-800
              w-full
              mt-5 p-2
              text-white
              uppercase
              font-bold
              hover:bg-gray-900
              '
              value='Registrar cliente'
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}
