import React from 'react'
import {useRouter} from 'next/router'
import Layout from '../../components/Layout'
import {useQuery, useMutation} from '@apollo/client'
import {OBTENER_PRODUCTO, ACTUALIZAR_PRODUCTO} from '../../queries/querys'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

export default function EditarProducto() {
  const router = useRouter()
  const {
    query: {id},
  } = router

  //consultar para obtener el producto
  const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  })

  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO)

  //Schema de validacion
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre del producto es obligatorio'),
    existencia: Yup.number()
      .required('Agrega la cantidad disponible')
      .positive('No se aceptan números negativos')
      .integer('La existencia debe ser números enteros'),
    precio: Yup.number()
      .required('El precio es obligatorio')
      .positive('No se aceptan números negativos'),
  })

  if (loading) return 'Cargado...'
  if (!data) {
    return 'Acción no permitida'
  }

  const actualizarInfoProducto = async valores => {
    const {nombre, existencia, precio} = valores

    try {
      const {data} = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      })
      console.log(data)
      //Redirigir a productos
      router.push('/productos')
      //Mostrar alerta
      Swal.fire(
        'Correcto',
        'El producto se actualizo correctamente!',
        'success'
      )
    } catch (error) {
      console.log(error)
    }
  }

  const {obtenerProducto} = data

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar producto</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={valores => {
              actualizarInfoProducto(valores)
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
                      placeholder='Nombre del producto'
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
                      htmlFor='existencia'
                      className='block text-gray-700 text-sm font-bold mb-2'>
                      Cantidad disponible:
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='existencia'
                      type='number'
                      placeholder='Cantidad disponible'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}
                  <div className='mb-4'>
                    <label
                      htmlFor='precio'
                      className='block text-gray-700 text-sm font-bold mb-2'>
                      Precio:
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='precio'
                      type='number'
                      placeholder='Precio'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>
                  {props.touched.precio && props.errors.precio ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.precio}</p>
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
                    value='Editar producto'
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
