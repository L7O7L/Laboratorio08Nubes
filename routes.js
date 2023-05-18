import express from 'express'
import { createOrUpdate, deleteProductById, getProductById, readAllProducts } from './db.js'

const router = express.Router()

router.get('/crud', async(req, res) => {
    const { success, data } = await readAllProducts()

    if(success){
        return res.render('crud', {data: data})
    }
    return res.status(500).json({success:false, messsage: "Error"})
})

router.get('/registrar', async(req, res) => {

    return res.render('register')

})

router.get('/product/:id', async(req, res) => {

    const { id } = req.params

    const productId = parseInt(id)

    const { success, data } = await getProductById(productId)

    if(success){
        return res.render('editar', {data: data})
    }

    return res.status(500).json({success: false, message: "Error"})
})

router.post('/create', async(req, res) => {
    
    const id = req.body.id
    const producto = req.body.producto
    const marca = req.body.marca
    const stock = req.body.stock
    const precio = req.body.precio

    const product = req.body
    product.id = parseInt(id)
    product.producto = producto
    product.marca = marca
    product.stock = stock
    product.precio = precio

    const { success, data } = await createOrUpdate(product)

    if(success){
        return res.redirect('/crud')
    }

    return res.status(500).json({success: false, message: 'Error'})
})

router.post('/edit/product', async(req, res) => {

    const id = req.body.id
    const producto = req.body.producto
    const marca = req.body.marca
    const stock = req.body.stock
    const precio = req.body.precio

    const product = req.body

    product.id = parseInt(id)
    product.producto = producto
    product.marca = marca
    product.stock = stock
    product.precio = precio

    const { success, data } = await createOrUpdate(product)

    if(success){
        return res.redirect('/crud')
    }

    return res.status(500).json({success: false, message: "Error"})
})

router.get('/delete/product/:id', async (req, res) => {

    const { id } = req.params

    const productId = parseInt(id)

    const { success, data } = await deleteProductById(productId)

    if (success) {
      return res.redirect('/crud')
    }
    return res.status(500).json({ success: false, message: 'Error'})
})
  



export default router