let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()
// Create Instance of MongoClient for mongodb
const DBURI = process.env.DBURI
const client = new MongoClient(DBURI)
const dbName = "gameDB";
const collectionName = "GameRoundReports"

client.connect(DBURI)
.then(() => console.log('Database Connected Successfully'))
.catch(error => console.log('Failed to connect', error))

const db =  client.db(dbName)
const collection=  db.collection(collectionName)


// console.log(result, "DB Response")


async function getGameIdData(gameRoundId){
    let url = process.env.GETGAMEIDDATAAPI
    const response = await fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.GAMEIDDATAKEY
        },
        body:JSON.stringify({
            gameRoundId: gameRoundId
        })
    });
    return response

}

describe("Game Id Data", ()=>{
    let gameRoundId = "lIJi1O-RRPSe6ki";
    
    describe(`Post ${process.env.GETGAMEIDDATAAPI}`, ()=>{
        let data
        let response
        let test
        before(async()=>{
            const result = await collection.find({gameRoundId:gameRoundId},{projection:{_id:0}}).toArray();
            await client.close()
            test = JSON.parse(JSON.stringify(result));
            // console.log(test, "DataBase Response")

            response= await getGameIdData(gameRoundId)
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it("Rake Account Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })
        
        it(`Data should have property report and its value should be Object`,()=>{
            expect(data.data[0]).to.have.property('report')
            expect(data.data[0].report).to.be.a('object')

        })

        it(`Data should have property time and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('time')
            expect(data.data[0].time).to.be.a('string')

        })
        it(`Data should have property serverId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('serverId')
            expect(data.data[0].serverId).to.be.a('string')

        })
        it(`Data should have property time and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('gameRoundId')
            expect(data.data[0].gameRoundId).to.be.a('string')

        })

    })
})


