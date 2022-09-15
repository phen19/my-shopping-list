import {faker} from "@faker-js/faker"
import {prisma} from "../../src/database"
import supertest from "supertest"

export function validItems(){
    return {
        title: faker.animal.crocodilia(),
        url: faker.internet.url(),
        description: faker.lorem.sentence(),
        amount: faker.datatype.number()
    }
}

export async function createItem(){
    const item = validItems()
    const insertedItem = await prisma.items.create({data: item})
    return insertedItem
}