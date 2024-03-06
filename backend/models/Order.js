import { model, Schema } from 'mongoose';

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    order_data: {
        type: Array,
        required: true,
    },
    img: {
        type: Array,
        required: true,
    }
})

export default model('order', OrderSchema)