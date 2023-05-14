import {db, Table} from './db.config.js'

const createOrUpdate = async (data = {}) =>{
    const params = {
        TableName: Table,
        Item: data
    }

    try{
        await db.put(params).promise()
        return { success: true }
    } catch(error){
        return { success: false, error: error}
    }
}

const readAllProducts = async()=>{
    const params = {
        TableName: Table
    }

    try{
        const { Items = [] } = await db.scan(params).promise()
        return { success: true, data: Items }

    } catch(error){
        return { success: false, data: null }
    }

}

const getProductById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
    try {
        const { Item = {} } =  await db.get(params).promise()
        return { success: true, data: Item }
    } catch (error) {
        return {  success: false, data: null}        
    }
}

const deleteProductById = async(value, key = 'id' ) => { 
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
        
    try {
        await db.delete(params).promise()
        return {  success: true }

    } catch (error) {
        return{ success: false }
    }
}


export {
    createOrUpdate,
    readAllProducts,
    getProductById,
    deleteProductById
}