import { db, Table } from './db.config.js'
import { DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const createOrUpdate = async (event) => {

    try {

        const requestBody = event;
        const params = {
            TableName: Table,
            Item: marshall(requestBody || {})
        }

        const response = await db.send(new PutItemCommand(params));

        return { success: true }

    } catch (error) {
        console.log(error)
        return { success: false, error: error }
    }
}

const readAllStudents = async () => {

    const params = {
        TableName: Table
    }

    try {
        const { Items } = await db.send(new ScanCommand(params))
        const students = (Items) ? Items.map((item) => unmarshall(item)) : {}
        return { success: true, data: students }

    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }

}

const getStudentById = async (studentId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id:  studentId})
    }
    try {
        const { Item } = await db.send(new GetItemCommand(params))

        const student = (Item) ? unmarshall(Item) : {};

        return { success: true, data: student }
    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }
}

const deleteStudentById = async (studentId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id: studentId })
    }

    try {
        const { Item } = await db.send(new DeleteItemCommand(params))
        
        const deletedStudent = (Item) ? unmarshall(Item) : {};

        return { success: true }

    } catch (error) {
        console.log(error)
        return { success: false }
    }
}


export {
    createOrUpdate,
    readAllStudents,
    getStudentById,
    deleteStudentById
}