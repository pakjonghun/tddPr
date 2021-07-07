const request = require('supertest');
const app = require('../../server');
const newProduct = require('../newProduct.json');
const allProduct = require('../allProduct.json')



it("POST /api/product",async()=>{
const response = await request(app).post('/api/product').send(newProduct);
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
    expect(response.body.price).toBe(newProduct.price)
})


it('should return 500 on POST /api/product',async()=>{
    const response = await request(app).post('/api/product').send({name:"1"});

    expect(response.status).toBe(500);


    console.log('response body',response.body)
    expect(response.body).toStrictEqual({message:'error is occured'})

})


it('GET /api/product',async()=>{
    const response =await request(app).get('/api/product');
    expect(response.statusCode).toBe(201);
    expect(response.body[0]).toBeDefined()
    expect(Array.isArray(response.body)).toBeTruthy();
})


it('GET /api/product/:id',async()=>{
    const response =await request(app).get('/api/product/'+'60e55ad13d73f21c61fc2354')
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe('productName')
})

it('Get /api/product/:id',async()=>{
    const response = await request(app).get('/api/product/'+'60e55ad13d73f21c61fc2364')
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({  "error": "fuck"})
})

it('GET /api/product/:id',async()=>{
    
    const response = await request(app).get('/api/product/'+'asdfsfd')
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({"message":"error is occured"})
})


it('PATCH /api/product/:id',async()=>{
    const response = await request(app)
        .patch('/api/product/'+'60e55a4fa79a1c1c4b0bf629').send({name:"1"})
        .send({name:'1'});
    expect(response.statusCode).toBe(201);
})