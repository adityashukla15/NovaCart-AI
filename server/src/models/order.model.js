const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderId:{

        type:String,

        unique:true,

        required:true,

    },

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true,

    },

    items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: String,
    slug: String,
    image: String,
    price: Number,
    quantity: Number,
    subtotal: Number,
  }
],

    shippingAddress: {

    fullName: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    addressLine1: {
        type: String,
        required: true,
    },

    addressLine2: {
        type: String,
        default: "",
    },

    city: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    postalCode: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    }

},

    totalAmount:{

        type:Number,

        required:true,

    },

    paymentMethod:{

        type:String,

        enum:["COD","CARD","UPI","NETBANKING"],

        default:"COD",

    },

    paymentStatus:{

        type:String,

        enum:["Pending","Paid"],

        default:"Paid",

    },

    orderStatus:{

        type:String,

        enum:[

            "Pending",

            "Confirmed",

            "Packed",

            "Shipped",

            "Delivered",

            "Cancelled"

        ],

        default:"Pending",

    }

},{

    timestamps:true,

});

module.exports=mongoose.model("Order",orderSchema);