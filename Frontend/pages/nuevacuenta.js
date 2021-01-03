import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const MUTATION_NEW_ACCOUNT = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`

const NuevaCuenta = () => {
  //State para el mensaje
  const [mensaje, setMensaje] = useState(null)

  //Mutation de GraphQl crear usuarios
  const [nuevoUsuario] = useMutation(MUTATION_NEW_ACCOUNT)

  //Routing
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string()
        .email('El email no es valido!')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('El password no puede ir vacio')
        .min(6, 'El password debe ser al menos de 6 caracteres'),
    }),
    onSubmit: async values => {
      const { nombre, apellido, email, password } = values

      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        })
        console.log(data)
        //Usuario creado correctamente
        setMensaje(
          `Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}`
        )
        setTimeout(() => {
          setMensaje(null)
          router.push('/login')
        }, 3000)

        //Redirigir usuario para iniciar sesion
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
    <>
      <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className='text-center text-2xl text-white font-light'>
          Crear nueva cuenta
        </h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form
              onSubmit={formik.handleSubmit}
              className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            >
              <div className='mb-4'>
                <label
                  htmlFor='nombre'
                  className='block text-gray-700 text-sm font-bold mb-2'
                >
                  Nombre:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nombre'
                  type='text'
                  placeholder='Nombre usuario'
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  className='block text-gray-700 text-sm font-bold mb-2'
                >
                  Apellido:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='apellido'
                  type='text'
                  placeholder='Apellido usuario'
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  htmlFor='email'
                  className='block text-gray-700 text-sm font-bold mb-2'
                >
                  Email:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='email'
                  type='email'
                  placeholder='Email usuario'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  htmlFor='password'
                  className='block text-gray-700 text-sm font-bold mb-2'
                >
                  Password:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='password'
                  type='password'
                  placeholder='Password usuario'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}
              <input
                type='submit'
                className='bg-gray-800 w-full mt-5 p-2 text-white hover:bg-gray-900'
                value='Crear cuenta'
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default NuevaCuenta
