const Product=require('../models/product')
const {StatusCodes}=require('http-status-codes');
const mongoose=require('mongoose');

const cateogorySearch=async(req,res)=>{
    try {
        const {category}=req.params;
        const {page=1,limit=10}=req.query;

        if(!category || typeof category!=="string"){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Invalid category name"})
        }

        const query={
            root_category_name:{$regex: new RegExp(`^${category}$`,'i')}
        }  
        const pageNum=parseInt(page,10);
        const limitNum=parseInt(limit,10);
        const skip=(pageNum-1)*limitNum
        
        const products=await Product.find(query).skip(skip).limit(limitNum);
        
        const totalProducts=await Product.countDocuments(query);
        const totalPages=Math.ceil(totalProducts/limitNum);

        if(products.length===0)
            return res.status(StatusCodes.NOT_FOUND).json({message:"No products found in this category"});

        return res.status(StatusCodes.OK).json({
            success:true,
            products,
            totalProducts,
            totalPages,
        });
    } catch (error) {
        console.log(`Error searching products by category: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"An error occurred while searching for products"
        })
    }
}
const idSearch=async(req,res)=>{
    const productId=req.params.id;
    try {
        // if(!mongoose.Types.ObjectId.isValid(productId)){
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         success:false,
        //         message:"Invalid product ID format"
        //     });
        // }

        const product=await Product.findById(productId);
        if(!product){
            return res.status(StatusCodes.NOT_FOUND).json({
                success:false,
                message:"Product not found"
            });
        }
        return res.status(StatusCodes.OK).json({
            success:true,
            product
        })
    } catch (error) {
        console.log(`error fetching product by id :${productId}` )
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"An error occurred while searching for the product"})
    }
}

const fuzzySearch=async(req,res)=>{
    try {
        const {q=" ",page=1,limit=10}=req.query;
        if(!q||typeof q!=="string"){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Invalid search query"});
        }

        const pipeline=[
            {
                $search:{
                    index:"product-search",
                    compound:{
                        should:[
                            {
                                autocomplete:{
                                    query:q,
                                    path:"product_name",
                                    fuzzy:{maxEdits:2}
                                }
                            },
                            {
                                text:{
                                    query:q,
                                    path:["brand","description","breadcrumbs"],
                                    fuzzy:{maxEdits:2}
                                }
                            }
                        ]
                    }
                }
            },
            {$skip: (parseInt(page,10)-1)*parseInt(limit,10)},
            { $limit: parseInt(limit) }
        ]

        const products=await Product.aggregate(pipeline);
        const count=products.length;
        return res.status(StatusCodes.OK).json({
            success:true,
            products,
            count

        })
    } catch (error) {
        console.log(`error searching products: ${error}`)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"An error occurred while searching for products"
        })
    }

}

module.exports={cateogorySearch,idSearch,fuzzySearch};