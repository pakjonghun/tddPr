const product =require("../product")


exports.createProduct=async(req,res,next)=>{
    try{
        const creaatedProduct =await  product.module.create(req.body);
         res.status(201).json(creaatedProduct);
    }catch(e){
        res.status(500);
        next(e);
    }
}

exports.readProduct=async(req,res,next)=>{
    try{
        const allProduct = await product.module.find({});
         res.status(201).json(allProduct);
    }catch(e){
        res.status(500);
        next(e);

    }
}

exports.readDetail=async(req,res,next)=>{
    try{
        const detail = await product.module.findById(req.params.id);
        if(detail===null){
            return res.status(404).json({error:"fuck"})
        }

        res.status(201).json(detail)
    }catch(e){
        res.status(500)
        next(e)
    }
}

exports.updateProduct=async(req,res,next)=>{
    try{
        const item =await product.module.exists({_id:req.params.id});
        if(!item){
            return res.status(404).send();
        }


        console.log(req.body)
        console.log(req.params)

        const upda = await product.module
            .updateOne({_id:req.params.id},{$set:{name:req.body.name}});
        console.log(upda)
        return  res.status(201).json(upda);
    }catch(e){
        next(e);
    }
}