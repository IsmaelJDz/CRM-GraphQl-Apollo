import React from 'react'
import {useRouter} from 'next/router'
import Swal from 'sweetalert2'
import Layout from '../../components/Layout'
import {useQuery, useMutation, gql} from '@apollo/client'
import {Formik} from 'formik'
import * as Yup from 'yup'

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`

export default function EditarCliente() {
  //Obtener el id actual

  const router = useRouter()
  const {
    query: {id},
  } = router

  //consultar para obtener el cliente
  const {data, loading, error, refetch} = useQuery(OBTENER_CLIENTE, {
    variables: {
      id,
    },
  })

  //Actualizar el cliente
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE)

  //Schema de validacion
  const validationSchema = Yup.object({
    nombre: Yup.string().required('El nombre del cliente es obligatorio'),
    apellido: Yup.string().required('El apellido del cliente es obligatorio'),
    empresa: Yup.string().required('La empresa del cliente es obligatorio'),
    email: Yup.string()
      .email('Email no válido')
      .required('El email del cliente es obligatorio'),
  })

  if (loading) return 'Cargando...'

  const {obtenerCliente} = data

  //Modifica el cliente en la DB
  const actualizarInfoCliente = async values => {
    const {nombre, apellido, empresa, email, telefono} = values
    try {
      const {data} = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      })
      //TODO: sweet alert
      Swal.fire(
        'Actualizado!',
        'El cliente se actualizo correctamente',
        'success'
      )

      refetch()
      //TODO: redirect user
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar cliente</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={values => {
              actualizarInfoCliente(values)
            }}>
            {props => {
              return (
                <form
                  onSubmit={props.handleSubmit}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.nombre}</p>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.apellido}</p>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.empresa}
                    />
                  </div>
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.empresa}</p>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.email}</p>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>
                  {props.touched.telefono && props.errors.telefono ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.telefono}</p>
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
                    value='Editar cliente'
                  />
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}
