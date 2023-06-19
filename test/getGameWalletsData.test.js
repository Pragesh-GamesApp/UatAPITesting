let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

// Create Instance of MongoClient for mongodb
const DBURI = process.env.DBBKURI;
const client = new MongoClient(DBURI)
const dbName = "bookkeeper";
const collectionName = "gameWallets"


client.connect(DBURI)
.then(() => console.log('Database Connected Successfully'))
.catch(error => console.log('Failed to connect', error))

const db =  client.db(dbName)
const collection=  db.collection(collectionName)


async function gameWalletsAPIData(endPoint = ''){
    let baseUrl = process.env.GAMEWALLETSAPI
    let url = baseUrl + endPoint
    let response = await fetch(url)
    return response
}
// Game Wallets API Testing (Check Object Property)

describe("Game Wallets API", ()=>{

    let endPoint = "1"
    describe(`Get ${process.env.GAMEWALLETSAPI}${endPoint}`, ()=>{
        let data
        let response
        let test
        before(async()=>{
            const result = await collection.find().toArray();

            // console.log(result, "DB Response")
            test = JSON.parse(JSON.stringify(result));
            // console.log(test, "DataBase Response")
            response= await gameWalletsAPIData(endPoint)
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it("Rake Account Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })
        
        it(`Data should have property _id and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('_id')
            expect(data.data[0]._id).to.be.a('string')

        })

        it(`Data should have property gameId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('gameId')
            expect(data.data[0].gameId).to.be.a('string')
        })

        it(`Data should have property amount and its value should be Number`,()=>{
            expect(data.data[0]).to.have.property('amount')
            expect(data.data[0].amount).to.be.a('number')
        })

        it(`Data should have property date and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('date')
            expect(data.data[0].date).to.be.a('string')
        })
        it(`Data Should have property totalData and value should be Number`,()=>{
            expect(data).to.have.property('totalData')
            expect(data.totalData).to.be.a('number')
        })
    })
})