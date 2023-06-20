let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

let userId = 226304
let userDB = Math.floor(userId/1000)
// Creating function For gameID

async function gameIdDatabase(userId){
    const DBURI_1 = process.env.DBBKURI
    const client = new MongoClient(DBURI_1)
    const dbName_1 = "bookkeeper"
    const collectionName_1 = "playerWallets"

    client.connect(DBURI_1)
    .then(() => console.log('Database Connected Successfully'))
    .catch(error => console.log('Failed to connect', error))

    const db =  client.db(dbName_1)
    const collection_1=  db.collection(collectionName_1)

    const result = await collection_1.find({"playerId": (userId).toString()}, {projection:{_id:0}}).toArray()
    await client.close()
    // const dbData = result.json()
    let test = JSON.parse(JSON.stringify(result));
    // console.log(test, "DB Data")

}



// Create Instance of MongoClient for mongodb

async function usersIdDatabase(){

    const DBURI = process.env.DBURI
    console.log(DBURI, "DB URI")
    console.log(__dirname);

    const client = new MongoClient(DBURI)
    const dbName = "gameDB";
    const collectionName = "users"+"_"+userDB

    client.connect(DBURI)
        .then(() => console.log('Database Connected Successfully'))
        .catch(error => console.log('Failed to connect', error))

    const db =  client.db(dbName)
    const collection=  db.collection(collectionName)
    const result = await collection.find({"userId": userId}, {projection:{_id:0}}).toArray()
    await client.close()
            // const dbData = result.json()
    let test = JSON.parse(JSON.stringify(result));
    let gameIdData = await gameIdDatabase(userId)
    // console.log(test,gameIdData, "DB Data")

    let finalResult  = {
        "userId": test[0].userId,
        "state": test[0].state,
        "serverAddress": test[0].serverAddress,
        "tableType": test[0].tableType,
        "entryFee": test[0].entryFee,
        "gameId": gameIdData?gameIdData.insideGame : "Not found"
}
    return finalResult
}





// const result = await collection.find({"userId": userId}).toArray();
// console.log(result, "DB Response")

async function getUserStatus(endPoint = ''){
    let baseUrl = process.env.GETUSERSTATUSAPI
    let url = baseUrl + endPoint
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.USERSTATUSAPIKEY
        }
    })
    return response
}

// User Status API Testing (Check Object Property)

describe("User Status API", ()=>{

    
    describe(`Get ${process.env.GETUSERSTATUSAPI}${userId}`, ()=>{
        let data
        let response
        let test
        before(async()=>{

            test = await usersIdDatabase()
            // console.log(test, "test")
            response= await getUserStatus(userId)
            data = await response.json()
            // console.log(data)
            
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })
        it("User Status API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })

        it(`Data should have property userId and its value should be Number`,()=>{
            expect(data.data).to.have.property('userId')
            expect(data.data.userId).to.be.a('number')

        })

        it(`Data should have property state and its value should be String`,()=>{
            expect(data.data).to.have.property('state')
            expect(data.data.state).to.be.a('number')
        })

        it(`Data should have property serverAddress and its value should be String`,()=>{
            expect(data.data).to.have.property('serverAddress')
            expect(data.data.serverAddress).to.be.a('string')
        })

        it(`Data should have property tableType and its value should be Number`,()=>{
            expect(data.data).to.have.property('tableType')
            expect(data.data.tableType).to.be.a('number')
        })
        it(`Data Should have property entryFee and value should be Number`,()=>{
            expect(data.data).to.have.property('entryFee')
            expect(data.data.entryFee).to.be.a('number')
        })
        it(`Data should have property gameId and its value should be String`,()=>{
            expect(data.data).to.have.property('gameId')
            expect(data.data.gameId).to.be.a('string')
        })
        it(`Data Should have property msg and value should be String`,()=>{
            expect(data).to.have.property('msg')
            expect(data.msg).to.be.a('string')
        })
    })
})



