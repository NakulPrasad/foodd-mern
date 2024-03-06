import Order from "../../models/Order.js";
import User from "../../models/User.js";

export const orderTest = (req, res) => {
    return res.status(200).json({ status: "Sucess", message: "Working" })
}

export const orderCheckout = async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { Order_date: req.body.order_date })

    let eId = await User.findOne({ 'email': req.body.email })
    // console.log(eId);
    if (eId === null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            }).then(() => {
                return res.json({ sucess: true })
            })
        } catch (error) {
            console.error(error.message);
            return res.send("Server error", error.message);
        }

    }
    else {
        try {
            await User.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data: data } }).then(() => {
                    return res.json({ sucess: true });
                })

        } catch (err) {
            return res.status(500).json({ msg: "Internal Server error", error: err.message });
        }
    }
}

export const getMyOrders = async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email });
        return res.json({ orderData: myData });

    } catch (error) {
        return res.send("Server error", error.message);
    }
}