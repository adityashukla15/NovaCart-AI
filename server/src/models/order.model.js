const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        slug: String,

        image: String,

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        subtotal: {
          type: Number,
          required: true,
        },
      },
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
      },
    },

    couponCode: {
    type: String,
    default: "",
},

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI", "NETBANKING"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    returnStatus: {
    type: String,
    enum: [
        "Not Requested",
        "Requested",
        "Accepted",
        "Rejected",
        "Returned",
        "Refund Initiated",
        "Refund Completed",
        "Exchanged",
    ],
    default: "Not Requested",
},

returnType: {
    type: String,
    enum: ["Return", "Exchange"],
    default: "Return",
},

returnReason: {
    type: String,
    default: "",
},

returnDescription: {
    type: String,
    default: "",
},

refundStatus: {
    type: String,
    enum: [
        "Not Applicable",
        "Pending",
        "Initiated",
        "Completed",
    ],
    default: "Not Applicable",
},

refundAmount: {
    type: Number,
    default: 0,
},

returnRequestedAt: {
    type: Date,
    default: null,
},

returnAcceptedAt: {
    type: Date,
    default: null,
},

returnedAt: {
    type: Date,
    default: null,
},

refundInitiatedAt: {
    type: Date,
    default: null,
},

refundCompletedAt: {
    type: Date,
    default: null,
},

exchangedAt: {
    type: Date,
    default: null,
},

returnRejectedAt: {
    type: Date,
    default: null,
},

subtotal: {
    type: Number,
    required: true,
},

discount: {
    type: Number,
    default: 0,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);