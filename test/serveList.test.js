let chai = require('chai') 
let expect = chai.expect
require('dotenv').config()

async function serverList(){
    let url = process.env.SERVERLISTAPI
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.SERVERLISTAPIKEY
        }
    })
    return response
}

describe("Server List API ", ()=>{

    describe(`Get ${process.env.SERVERLISTAPI}`, ()=>{
        let data
        let response
        before(async()=>{
            response= await serverList()
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it(`Data should have property Players and its value should be Array`,()=>{
            expect(data.servers[0]).to.have.property('players')
            expect(data.servers[0].players).to.be.a('array')

        })

        it(`Data should have property gameId and its value should be String`,()=>{
            expect(data.servers[0]).to.have.property('gameId')
            expect(data.servers[0].gameId).to.be.a('string')
        })

        it(`Data should have property gameState and its value should be String`,()=>{
            expect(data.servers[0]).to.have.property('gameState')
            expect(data.servers[0].gameState).to.be.a('string')
        })

        it(`Data should have property gameTimer and its value should be Number`,()=>{
            expect(data.servers[0]).to.have.property('gameTimer')
            expect(data.servers[0].gameTimer).to.be.a('number')
        })
        it(`Data Should have property currentTurn and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('currentTurn')
            expect(data.servers[0].currentTurn).to.be.a('string')
        })
        it(`Data Should have property type and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('type')
            expect(data.servers[0].type).to.be.a('string')
        })

        it(`Data Should have property state and value should be Number`,()=>{
            expect(data.servers[0]).to.have.property('state')
            expect(data.servers[0].state).to.be.a('number')
        })

        it(`Data Should have property serverState and value should be Number`,()=>{
            expect(data.servers[0]).to.have.property('serverState')
            expect(data.servers[0].serverState).to.be.a('number')
        })

        it(`Data Should have property id and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('id')
            expect(data.servers[0].id).to.be.a('string')
        })

        it(`Data Should have property name and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('name')
            expect(data.servers[0].name).to.be.a('string')
        })

        it(`Data Should have property address and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('address')
            expect(data.servers[0].address).to.be.a('string')
        })

        it(`Data Should have property version and value should be String`,()=>{
            expect(data.servers[0]).to.have.property('version')
            expect(data.servers[0].version).to.be.a('string')
        })
    })
})