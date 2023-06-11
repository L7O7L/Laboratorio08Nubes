import express from 'express'
import { createOrUpdate, deleteStudentById, getStudentById, readAllStudents } from './db.js'
import { uploadFile, getFiles, getFile, downloadFile } from './s3.js'

const router = express.Router()

router.get('/crud', async (req, res) => {
    const { success, data } = await readAllStudents()

    if (success) {
        return res.render('crud', { data: data })
    }
    return res.status(500).json({ success: false, messsage: "Error" })
})

router.get('/registrar', async (req, res) => {

    return res.render('register')

})

router.get('/student/:id', async (req, res) => {

    const { id } = req.params

    const estudentId = parseInt(id)

    const { success, data } = await getStudentById(estudentId)

    if (success) {
        return res.render('editar', { success: false, data: data })
    }

    return res.status(500).json({ success: false, message: "Error" })
})

router.post('/create', async (req, res) => {

    const id = req.body.id
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const fecha_nac = req.body.fecha_nac
    const email = req.body.email
    const img = req.files

    const results = JSON.parse(JSON.stringify(img))
    var {img: {name: Name}} = results
    console.log(results.img)

    const student = req.body
    student.id = parseInt(id) 
    student.nombre = nombre
    student.apellido = apellido
    student.fecha_nac = fecha_nac
    student.email = email
    student.img = Name

    await uploadFile(results.img)

    await downloadFile(Name)

    const { success, data } = await createOrUpdate(student)

    if (success) {
        return res.redirect('/crud')
    }

    return res.status(500).json({ success: false, message: 'Error' })
})

router.post('/edit/student', async (req, res) => {

    const id = req.body.id
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const fecha_nac = req.body.fecha_nac
    const email = req.body.email
    const img = req.files

    console.log(img)

    const results = JSON.parse(JSON.stringify(img))
    var {img: {name: Name}} = results
    console.log(results.img)

    const student = req.body

    student.id = parseInt(id) 
    student.nombre = nombre
    student.apellido = apellido
    student.fecha_nac = fecha_nac
    student.email = email
    student.img = Name

    await uploadFile(results.img)

    await downloadFile(Name)

    const { success, data } = await createOrUpdate(student)

    if (success) {
        return res.redirect('/crud')
    }

    return res.status(500).json({ message: "Error" })
})

router.get('/delete/student/:id', async (req, res) => {

    const { id } = req.params

    const studentId = parseInt(id)

    const { success, data } = await deleteStudentById(studentId)

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