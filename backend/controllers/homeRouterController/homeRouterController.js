import FoodItems from '../../models/FoodItems.js'

export const homeTest = (req,res)=>{
    return res.status(200).json({status:"Sucess", message:"Working"})
}

export const getFoodDetails = async (req,res)=>{
    try {
        const id = "648c815729278cfb1dbce239";
        const food = await FoodItems.findById(id);
        if(food) return res.status(200).json({data : food});
        return res.status(500).json({msg:"Food Added Successfully"});
    } catch (error) {
        console.error(error);
        return res.send( {msg: "Server error", err: error.message} );
    }
}

export const addFoodItem =async (req,res)=>{
    try {
        const food = req.body;
        const foodAdded = await FoodItems.create(food)
        if(foodAdded) return res.status(200).json({msg:"Food Added Sucessfully", data:foodAdded});
        return res.status(500).json({msg:"Can't Add Food"});
    } catch (error) {
        return res.status(500).json({msg: "Can't add Food", err: error.message});
    }
}

export const getFoodData = async(req, res)=>{
    try {

        return res.send([global.foodItems, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.send("Server error");
    }
}
