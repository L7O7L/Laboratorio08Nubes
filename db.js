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

const readAllProducts = async () => {

    const params = {
        TableName: Table
    }

    try {
        const { Items } = await db.send(new ScanCommand(params))
        const products = (Items) ? Items.map((item) => unmarshall(item)) : {}
        return { success: true, data: products }

    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }

}

const getProductById = async (productId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id:  productId})
    }
    try {
        const { Item } = await db.send(new GetItemCommand(params))

        const product = (Item) ? unmarshall(Item) : {};

        return { success: true, data: product }
    } catch (error) {
        console.log(error)
        return { success: false, data: null }
    }
}

const deleteProductById = async (productId) => {
    const params = {
        TableName: Table,
        Key: marshall({ id: productId })
    }

    try {
        const { Item } = await db.send(new DeleteItemCommand(params))
        
        const deletedProduct = (Item) ? unmarshall(Item) : {};

        return { success: true }

    } catch (error) {
        console.log(error)
        return { success: false }
    }
}


export {
    createOrUpdate,
    readAllProducts,
    getProductById,
    deleteProductById
}