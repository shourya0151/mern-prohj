import mongoose from 'mongoose';


const bookedSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        userId:{
            type: String,
            required: true,
        },
        ShowId:{
            type: String,
            required: true,
        },
        ShowName:{
            type: String,
            required: true,
        },
    },{timestamps: true}
);

const Booked = mongoose.model('Booked',bookedSchema);
export default Booked;
//Hello