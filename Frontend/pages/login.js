import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Layout from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {useMutation, gql} from '@apollo/client'

const AUTH_USER = gql`
  mutation autenticaUsuario($input: AutenticarInput) {
    autenticaUsuario(input: $input) {
      token
    }
  }
`

const Login = () => {
  const [mensaje, setMensaje] = useState(null)

  //Mutarion para crear nuevos usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTH_USER)

  //routing
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El email no es válido')
        .required('El email no puede estar vacio'),
      password: Yup.string().required('El password es obligario'),
    }),
    onSubmit: async values => {
      const {email, password} = values

      try {
        const {data} = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        })
        setMensaje('Autenticando...')

        //Guardar token en localStorage
        setTimeout(() => {
          const {token} = data.autenticaUsuario
          localStorage.setItem('tkn', token)
        }, 1000)

        //Redireccionar a home
        setTimeout(() => {
          setMensaje(null)
          router.push('/')
        }, 2000)

        //Redirect hacia clientes
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
        <h1 className='text-center text-2xl text-white font-light'>Login</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form
              onSubmit={formik.handleSubmit}
              className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'>
              <div className='mb-4'>
                <label
                  htmlFor='email'
                  className='block text-gray-700 text-sm font-bold mb-2'>
                  Email:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='email'
                  type='email'
                  placeholder='Email usuario'
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
                  htmlFor='password'
                  className='block text-gray-700 text-sm font-bold mb-2'>
                  Password:
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='password'
                  type='password'
                  placeholder='Password usuario'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
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
                value='Iniciar sesión'
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Login
