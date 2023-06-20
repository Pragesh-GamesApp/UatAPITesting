let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

// Create Instance of MongoClient for mongodb
const DBURI = process.env.DBBKURI
const client = new MongoClient(DBURI)
const dbName = "bookkeeper";
const collectionName = "playerWallets"
client.connect(DBURI)
.then(() => console.log('Database Connected Successfully'))
.catch(error => console.log('Failed to connect', error))
const db =  client.db(dbName)
const collection=  db.collection(collectionName)




async function playerWalletsAPIData(endPoint = ''){
    let baseUrl = process.env.PLAYERWALLETSAPI
    let url = baseUrl + endPoint
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.PLAYERWALLETDATAAPIKEY
        }
    })
    return response
}

// Player Wallets API Testing (Check Object Property)

describe("Player Wallets API", ()=>{

    let endPoint = "1"
    describe(`Get ${process.env.PLAYERWALLETSAPI}${endPoint}`, ()=>{
        let data
        let response
        let test
        before(async()=>{
            const result = await collection.find({}).limit(5).sort({date:-1}).toArray()
            // const dbData = result.json()
            test = JSON.parse(JSON.stringify(result));
            // console.log(test, "Testing")
            response= await playerWalletsAPIData(endPoint)
            data = await response.json()
            
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })
        it("Player Wallets Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })
        it(`Data should have property _id and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('_id')
            expect(data.data[0]._id).to.be.a('string')

        })

        it(`Data should have property playerId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('playerId')
            expect(data.data[0].playerId).to.be.a('string')
        })

        it(`Data should have property amount and its value should be Number`,()=>{
            expect(data.data[0]).to.have.property('amount')
            expect(data.data[0].amount).to.be.a('number')
        })

        it(`Data should have property date and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('date')
            expect(data.data[0].date).to.be.a('string')
        })
        
        // it(`Data Should have property insideGame and value should be String or Undefined`,()=>{
        //     // console.log(data.data[0])
        //     // if(data.data[0].hasOwnProperty("insideGame")){
        //         expect(data).to.have.property('insideGame')
        //         expect(data.data[0].insideGame).to.be.a('string', 'undefined')
        //     // }
        // })

        it(`Data Should have property totalData and value should be Number`,()=>{
            expect(data).to.have.property('totalData')
            expect(data.totalData).to.be.a('number')
        })
    })
})