const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

const createToken = (usuario, secret, expiresIn) => {
  const { id, email, nombre, apellido } = usuario;

  return jwt.sign({ id, email, nombre, apellido }, secret, { expiresIn });
};

// Resolver
const resolvers = {
  Query: {
    obtenerUsuario: async (_, {}, ctx) => {
      console.log(ctx);
      return ctx.usuario;
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      try {
        //Revisar si existe o no el producto
        const producto = await Producto.findById(id);

        if (!producto) {
          throw new Error('Producto no encontrado');
        }

        return producto;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      console.log(id);
      // Revisar si el cliente existe o no
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      // Quien lo creo puede verlo
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      return cliente;
    },
    obtenerPedidos: async () => {
      try {
        const pedidos = await Pedido.find({});
        return pedidos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      try {
        const pedidos = await Pedido.find({
          vendedor: ctx.usuario.id,
        }).populate('cliente');
        return pedidos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      //Si el pedido existe
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }
      //Solo quien lo creo puede verlo
      if (pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      //Retornar el resultado
      return pedido;
    },
    obtenerPedidosEstado: async (_, { estado }, ctx) => {
      const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });

      return pedidos;
    },
    mejoresClientes: async () => {
      //cliente es el nombre del modelo
      // _id: Obtiene todos los registros por _id y los suma con $sum ylookup es un join
      const clientes = await Pedido.aggregate([
        { $match: { estado: 'COMPLETADO' } },
        { $group: { _id: '$cliente', total: { $sum: '$total' } } },
        {
          $lookup: {
            from: 'clientes',
            localField: '_id',
            foreignField: '_id',
            as: 'cliente',
          },
        },
        {
          $limit: 3,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return clientes;
    },
    mejoresVendedores: async () => {
      const vendedores = await Pedido.aggregate([
        { $match: { estado: 'COMPLETADO' } },
        { $group: { _id: '$vendedor', total: { $sum: '$total' } } },
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: '_id',
            as: 'vendedor',
          },
        },
        {
          $limit: 3,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return vendedores;
    },
    buscarProducto: async (_, { texto }) => {
      const producto = await Producto.find({ $text: { $search: texto } }).limit(
        10
      );
      return producto;
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      const existUser = await Usuario.findOne({ email });

      if (existUser) {
        throw new Error('El usuario ya esta registrado');
      }

      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);

      try {
        const usuario = Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },

    autenticaUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error('El usuario no existe');
      }

      //Revisar si el password es correcto
      const passwordCorrecto = await bcrypt.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error('El Password es Incorrecto');
      }

      //Crear token
      return {
        token: createToken(existeUsuario, process.env.SECRET, '24h'),
      };
    },

    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        // save on db
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      producto = await Producto.findOneAndUpdate({ _id: id }, input, {
        new: true,
        useFindAndModify: false,
      });
      return producto;
    },
    eliminarProducto: async (_, { id }) => {
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      //other delete await Producto.findOneAndDelete({ _id : id })
      await Producto.findByIdAndDelete(id);
      return 'Producto Eliminado';
    },
    nuevoCliente: async (_, { input }, ctx) => {
      //Verificar si el cliente ya esta registrado
      const { email } = input;
      const cliente = await Cliente.findOne({ email });

      if (cliente) {
        throw new Error('Ese cliente ya esta registrado');
      }

      const nuevoCliente = new Cliente(input);

      //Asignar el vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      //Guardarlo en la base de datos
      try {
        const resultadoCliente = await nuevoCliente.save();
        return resultadoCliente;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      //verificar si existe o no
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Este Cliente no existe');
      }

      //Verificar si el vendedor es quien edita
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      // Guardar el cliente
      cliente = await Cliente.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return cliente;
    },
    eliminarCliente: async (_, { id }, ctx) => {
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      //Verificar si el vendedor es quien edita
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      await Cliente.findByIdAndDelete(id);
      return 'Producto Eliminado';
    },
    nuevoPedido: async (_, { input }, ctx) => {
      console.log(input);
      const { cliente } = input;
      //verificar si el cliente existe o no
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) {
        throw new Error('Ese cliente no existe');
      }
      //verificar si el cliente es el vendedor
      if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }
      //revisar que el stock este disponible
      //input.pedido.forEach(async articulo => {
      for await (const articulo of input.pedido) {
        const { id, cantidad } = articulo;
        const producto = await Producto.findById(id);

        if (articulo.cantidad > producto.existencia) {
          throw new Error(
            `El articulo: ${producto.nombre} excede la cantidad disponible`
          );
        } else {
          //Restar la cantidad a lo disponible
          producto.existencia = producto.existencia - cantidad;
          await producto.save();
        }
      }

      // Crear un nuevo pedido
      const nuevoPedido = new Pedido(input);

      //asignarle un vendedor
      nuevoPedido.vendedor = ctx.usuario.id;

      //guardarlo en la base de datos
      const resultado = await nuevoPedido.save();
      return resultado;
    },
    actualizarPedido: async (_, { id, input }, ctx) => {
      const { cliente } = input;
      //verificar si el pedido existe
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error('El pedido no existe');
      }

      //si el cliente existe
      const existeCliente = await Cliente.findById(cliente);
      if (!existeCliente) {
        throw new Error('El cliente no existe');
      }
      //si  el cliente y pedido pertenecen al vendedor
      if (existeCliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      //Revisar el stock
      if (input.pedido) {
        for await (const articulo of input.pedido) {
          const { id } = articulo;
          const producto = await Producto.findById(id);

          if (articulo.cantidad > producto.existencia) {
            throw new Error(
              `El articulo: ${producto.nombre} excede la cantidad disponible`
            );
          } else {
            //Restar la cantidad a lo disponible
            producto.existencia = producto.existencia - articulo.cantidad;
            await producto.save();
          }
        }
      }

      //actualizar el pedido
      const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, {
        new: true,
        useFindAndModify: false,
      });

      return resultado;
    },
    eliminarPedido: async (_, { id }, ctx) => {
      //Revisar si existe el pedido
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error('El pedido no existe');
      }

      //si  el cliente y pedido pertenecen al vendedor
      if (existePedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales');
      }

      await Pedido.findByIdAndDelete(id);
      return 'Pedido Eliminado';
    },
  },
};

module.exports = resolvers;
