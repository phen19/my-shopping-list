import app from "../src/app"
import supertest from "supertest"
import {prisma} from "../src/database"
import { validItems, createItem } from "./factories/itemsFactory"

beforeAll(async () =>{
  await prisma.$executeRaw`TRUNCATE TABLE items RESTART IDENTITY`
})
describe('Testa POST /items ', () => {
  const body = validItems()
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const result = await supertest(app).post("/items").send(body)
    expect(result.status).toEqual(201)

  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const result = await supertest(app).post("/items").send(body)
    expect(result.status).toEqual(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async() => {
    const result = await supertest(app).get("/items").send()
    expect(result.status).toEqual(200) 
    expect(result.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async() =>{
    const item = await createItem()
    const result = await supertest(app).get(`/items/${item.id}`).send()
    expect(result.status).toEqual(200)
    expect(result.body).toEqual(expect.objectContaining(item))
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async() =>{
    const result = await supertest(app).get("/items/0").send()
    expect(result.status).toEqual(404)
  });
});
