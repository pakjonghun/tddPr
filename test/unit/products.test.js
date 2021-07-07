//0. 무엇을 작성할지 구상한다.
//1. tdd 는 맨 처음 테스트 코드를 작성한다.
//2. 본 소스 작성한다.

const productController = require('../../controllers/productController');
const ProductModel = require('../../product');
const httpMocks = require('node-mocks-http')
const newProduct = require('../newProduct.json');
const allProduct = require("../allProduct.json");

//어떤 것과 호출도는데
//몇번호출되는지 등등 알수 있게 해주는 스파이 역할을 한다.
ProductModel.module.create = jest.fn()
ProductModel.module.find = jest.fn()
ProductModel.module.findById=jest.fn()
ProductModel.module.exists=jest.fn()
ProductModel.module.updateOne=jest.fn();
    


let req,res,next;
beforeEach(()=>{
     req = httpMocks.createRequest();
     res = httpMocks.createResponse();
     next = jest.fn();
})


describe('product controller create',()=>{

    beforeEach(()=>{
        req.body = newProduct;
        
    })


    it('should have a createProduct function',()=>{
        expect(typeof productController.createProduct).toBe("function");
    })

    it('should call productModel.create',()=>{
        productController.createProduct(req,res,next);
        expect(ProductModel.module.create).toBeCalledWith(newProduct);
    })

    it('should return 201 status code and send data',async()=>{
        await productController.createProduct(req,res,next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    //toStrictEqual 은 객체 형식이 같은지 비교한다.
    //_getJSONDATA() 는 mock http 메서드로 제이슨 데이터를 가져온다.
    it('should return json response',async()=>{
        const pr = ProductModel.module.create.mockReturnValue(newProduct);
        await productController.createProduct(req,res,next);
        expect(res._getJSONData()).toStrictEqual(newProduct)
    })

    
    it('should handle error',async()=>{
        const errorMessage = {error:"description is missing"};
        const rejectPromise = Promise.reject(errorMessage);
        ProductModel.module.create.mockReturnValue(rejectPromise);
        await productController.createProduct(req,res,next);
        expect(next).toBeCalledWith(errorMessage);
        expect(res.statusCode).toBe(500);
    })
})


describe('read test',()=>{
    it('should be a function',()=>{
        expect(typeof productController.readProduct).toBe("function");
    })

    it('should active find',async()=>{
        await productController.readProduct(req,res,next);
        expect(ProductModel.module.find).toBeCalledWith({})
    })

    it('should return 200 status code',async()=>{
        await productController.readProduct(req,res,next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled).toBeTruthy();
    })

    it('should return data',async()=>{
        ProductModel.module.find.mockReturnValue(allProduct);
        await productController.readProduct(req,res,next);
        expect(res._getJSONData()).toStrictEqual(allProduct)
    })

    it('shoul return error',async()=>{
        const errorMsg = {message:"error is occured"};
        const rejectPromist = Promise.reject(errorMsg);
        ProductModel.module.find.mockReturnValue(rejectPromist);
        await productController.readProduct(req,res,next);
        expect(next).toBeCalledWith(errorMsg);
        expect(res.statusCode).toBe(500)
    })

})

describe('find by id tests',()=>{

    beforeEach(()=>{
        req.params={id:1}
    })

    it('should be function',()=>{
        expect(typeof productController.readDetail).toBe('function');
    })

    it('should be call finbyid',async()=>{
         await productController.readDetail(req,res,next);

         expect(ProductModel.module.findById).toBeCalledWith(req.params.id)

    })


    it('should return 201 statusCode',async()=>{
        await productController.readDetail(req,res,next);
        expect(res.statusCode).toBe(201);
        
    })

    it('should return json data',async()=>{
        const a  =ProductModel.module.findById.mockReturnValue(newProduct);
        console.log(a)
        await productController.readDetail(req,res,next);
        expect(res._isEndCalled).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newProduct);
    })

    it('should return error',async()=>{
        ProductModel.module.findById.mockReturnValue(null);
        await productController.readDetail(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })


    it('should rejected error',async()=>{
        const errorMessage  = {msg:"fuck"}
        const promiseRejected = Promise.reject(errorMessage);
        ProductModel.module.findById.mockReturnValue(promiseRejected);
        await productController.readDetail(req,res,next);
        expect(next).toBeCalledWith(errorMessage);
        expect(res.statusCode).toBe(500)
        expect(res._isEndCalled).toBeTruthy()

    })
})




describe('updateTests',()=>{

    beforeEach(()=>{
        req.params={id:1}
        req.body={name:1}
    })
    it('should be function',()=>{
        expect(typeof productController.updateProduct).toBe('function');
    })

    it('should be called updateOne, exists',async()=>{
        ProductModel.module.exists.mockReturnValue(true);
        ProductModel.module.updateOne.mockReturnValue(newProduct)
        await productController.updateProduct(req,res,next);
        expect(ProductModel.module.exists).toBeCalledWith({_id:req.params.id});
        expect(ProductModel.module.updateOne).toBeCalledWith({_id:req.params.id},{$set:{name:req.body.name}})
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(newProduct)
        expect(res._isEndCalled).toBeTruthy()
    })

    it('should return 404',async()=>{
        ProductModel.module.exists.mockReturnValue(false);
        await productController.updateProduct(req,res,next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy()
    })

    it('should return error',async()=>{
        const errorMessage = {error:"fuck"}
        const promiseReject = Promise.reject(errorMessage);
        ProductModel.module.exists.mockReturnValue(promiseReject);
        await productController.updateProduct(req,res,next);
        expect(next).toBeCalledWith(errorMessage)
    })

})