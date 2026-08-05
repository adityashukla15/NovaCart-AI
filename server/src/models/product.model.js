 const mongoose=require('mongoose')

 const productSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },

    description: {
        type: String,
        required: true,
    },

    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
},
averageRating:{

    type:Number,

    default:0,

},

    brand: {
        type: String,
        default: "",
    },

    price: {
        type: Number,
        required: true,
    },

    discountPrice: {
        type: Number,
        default: 0,
    },

    stock: {
        type: Number,
        required: true,
        default: 0,
    },

    images: [
        {
            type: String,
        }
    ],

    sizes: [
        {
            type: String,
        }
    ],

    colors: [
        {
            type: String,
        }
    ],

    rating: {
        type: Number,
        default: 0,
    },

    totalReviews: {
        type: Number,
        default: 0,
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isDeleted: {
    type: Boolean,
    default: false,
},

deletedAt: {
    type: Date,
    default: null,
},

 },{timestamps:true})

 module.exports=mongoose.model('Product',productSchema)