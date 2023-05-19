import express from 'express'
import { createOrUpdate, deleteProductById, getProductById, readAllProducts } from './db.js'
import { uploadFile, getFiles, getFile, downloadFile } from './s3.js'

const router = express.Router()

router.get('/crud', async (req, res) => {
    const { success, data } = await readAllProducts()

    if (success) {
        return res.render('crud', { data: data })
    }
    return res.status(500).json({ success: false, messsage: "Error" })
})

router.get('/registrar', async (req, res) => {

    return res.render('register')

})

router.get('/product/:id', async (req, res) => {

    const { id } = req.params

    const productId = parseInt(id)

    const { success, data } = await getProductById(productId)

    if (success) {
        return res.render('editar', { success: false, data: data })
    }

    return res.status(500).json({ success: false, message: "Error" })
})

router.post('/create', async (req, res) => {

    const id = req.body.id
    const producto = req.body.producto
    const marca = req.body.marca
    const stock = req.body.stock
    const precio = req.body.precio
    const img = req.files

    const results = JSON.parse(JSON.stringify(img))
    var {img: {name: Name}} = results
    console.log(results.img)

    const product = req.body
    product.id = parseInt(id) 
    product.producto = producto
    product.marca = marca
    product.stock = stock
    product.precio = precio
    product.img = Name

    await uploadFile(results.img)

    await downloadFile(Name)

    const { success, data } = await createOrUpdate(product)

    if (success) {
        return res.redirect('/crud')
    }

    return res.status(500).json({ success: false, message: 'Error' })
})

router.post('/edit/product', async (req, res) => {

    const id = req.body.id
    const producto = req.body.producto
    const marca = req.body.marca
    const stock = req.body.stock
    const precio = req.body.precio
    const img = req.files

    console.log(img)

    const results = JSON.parse(JSON.stringify(img))
    var {img: {name: Name}} = results
    console.log(results.img)

    const product = req.body

    product.id = parseInt(id)
    product.producto = producto
    product.marca = marca
    product.stock = stock
    product.precio = precio
    product.img = Name

    await uploadFile(results.img)

    await downloadFile(Name)

    const { success, data } = await createOrUpdate(product)

    if (success) {
        return res.redirect('/crud')
    }

    return res.status(500).json({ message: "Error" })
})

router.get('/delete/product/:id', async (req, res) => {

    const { id } = req.params

    const productId = parseInt(id)

    const { success, data } = await deleteProductById(productId)

    console.log(success)

    if (success) {
        return res.redirect('/crud')
    }
    return res.status(500).json({ success: false, message: 'Error' })
})

router.post('/files', async (req, res) => {

    const result = await uploadFile(req.files.file)

    console.log(req.files.file)

    res.json({ result: result })

})

router.get('/getfiles', async (req, res) => {

    const result = await getFiles()

    res.json(result.Contents)

})

router.get('/file/:fileName', async (req, res) => {

    const result = await getFile(req.params.fileName)

    res.json(result.$metadata)

})

router.get('/downloadfile/:fileName', async (req, res) => {

    await downloadFile(req.params.fileName)

    res.json({ message: 'Archivo descargado' })

})


export default router