import request from "supertest";
import server from "../../server";
import e from "express";

describe("POST /api/products", () => {

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

        it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 'Hola'
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new product and return it', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Mouse - Testing',
            price: 50
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })

})

describe("GET /api/products", () => {

    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe("GET /api/products/:id", () => {

    it('should check a valid ID en the URL', async () => {
        const response = await request(server)
                                .put('/api/products/not-valid-url')
                                .send({
                                    name: 'Monitor Curvo',
                                    availability: 'true',
                                    price: 300
                                })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID must be a Integer')
    })


    it('should return a 404 response for a non-existent product', async () => {
        const productoId = 2000
        const response = await request(server).get(`/api/products/${productoId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.body.error).toBe('Product not found')
    })

    it('should check a valid ID en the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID must be a Integer')
    })

    it('get a JSON response for a single producto', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })

})

describe("PUT /api/products/:id", () => {
    it('should display validation error messages when updating a producto', async () => {
        const response = await request(server).put('/api/products/1').send({})
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greather than 0', async () => {
        const response = await request(server)
                                .put('/api/products/1')
                                .send({
                                    name: 'Monitor Curvo',
                                    availability: 'true',
                                    price: 0
                                })
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Price must be greater than zero')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

     it('should return a 404 response for a non-existent product', async () => {
        const productoId = 2000
        const response = await request(server)
                                .put(`/api/products/${productoId}`)
                                .send({
                                    name: 'Monitor Curvo',
                                    availability: 'true',
                                    price: 300
                                })
        
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server)
                                .put('/api/products/1')
                                .send({
                                    name: 'Monitor Curvo',
                                    availability: 'true',
                                    price: 300
                                })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe("PATCH /api/products/:id", () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productoId = 2000
        const response = await request(server)
                                .patch(`/api/products/${productoId}`)
                                .send({availability: true})
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Product not found')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the availability of an existing product', async () => {
        const response = await request(server)
                                .patch('/api/products/1')
                                .send({availability: false})
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe("DELETE /api/products/:id", () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID must be a Integer')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productoId = 2000
        const response = await request(server).delete(`/api/products/${productoId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Product deleted successfully')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})