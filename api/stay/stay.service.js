const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')
const asyncLocalStorage = require('../../services/als.service')

query()
async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        // console.log(collection)

        const stays = await collection.find(criteria).toArray()
        
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        console.log('cannot find stays', err)
        throw err
    }

}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ '_id': ObjectId(stayId) })
        return stay;
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('stay')
        // remove only if user is owner/admin
        const query = { _id: ObjectId(stayId) }
        if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
        // return await collection.deleteOne({ _id: ObjectId(stayId), byUserId: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}


async function add(stay) {
    try {
        // peek only updatable fields!
        // const stayToAdd = {
        //     // byUserId: ObjectId(stay.byUserId),
        //     // aboutUserId: ObjectId(stay.aboutUserId),
        //     // txt: stay.txt
        // }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        // await collection.insertOne(stayToAdd)
        return stay;
        // return stayToAdd;
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    getById,
    remove,
    add
}


