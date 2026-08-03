const Address=require('../models/address.model')

const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


// ======================================
// CREATE ADDRESS
// ======================================

const createAddress = asyncHandler(async (req, res) => {

    const {

        fullName,

        phone,

        addressLine1,

        addressLine2,

        city,

        state,

        postalCode,

        country,

        isDefault,

    } = req.body;

    if (

        !fullName ||

        !phone ||

        !addressLine1 ||

        !city ||

        !state ||

        !postalCode

    ) {

        throw new ApiError(400, "All required fields are mandatory");

    }

    // If this address is default, remove default from others
    if (isDefault) {

        await Address.updateMany(

            { user: req.user._id },

            { $set: { isDefault: false } }

        );

    }

    // If first address, make default automatically
    const totalAddresses = await Address.countDocuments({

        user: req.user._id

    });

    const address = await Address.create({

        user: req.user._id,

        fullName,

        phone,

        addressLine1,

        addressLine2,

        city,

        state,

        postalCode,

        country,

        isDefault: totalAddresses === 0 ? true : isDefault,

    });

    return res.status(201).json(

        new ApiResponse(

            201,

            "Address added successfully",

            address

        )

    );

});


// ======================================
// GET ALL ADDRESSES
// ======================================

const getAllAddresses = asyncHandler(async (req, res) => {

    const addresses = await Address.find({

        user: req.user._id

    }).sort({

        isDefault: -1,

        createdAt: -1,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Addresses fetched successfully",

            addresses

        )

    );

});


// ======================================
// GET ADDRESS BY ID
// ======================================

const getAddressById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const address = await Address.findOne({

        _id: id,

        user: req.user._id,

    });

    if (!address) {

        throw new ApiError(404, "Address not found");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Address fetched successfully",

            address

        )

    );

});

const updateAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {

        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,

    } = req.body;

    const address = await Address.findOne({

        _id: id,

        user: req.user._id,

    });

    if (!address) {

        throw new ApiError(404, "Address not found");

    }

    if (isDefault) {

        await Address.updateMany(

            { user: req.user._id },

            { $set: { isDefault: false } }

        );

    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;

    if (typeof isDefault === "boolean") {
        address.isDefault = isDefault;
    }

    await address.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Address updated successfully",

            address

        )

    );

});
const deleteAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const address = await Address.findOne({

        _id: id,

        user: req.user._id,

    });

    if (!address) {

        throw new ApiError(404, "Address not found");

    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    // If deleted address was default,
    // make another address default
    if (wasDefault) {

        const firstAddress = await Address.findOne({

            user: req.user._id

        }).sort({

            createdAt: 1

        });

        if (firstAddress) {

            firstAddress.isDefault = true;

            await firstAddress.save();

        }

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            "Address deleted successfully"

        )

    );

});

const setDefaultAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const address = await Address.findOne({

        _id: id,

        user: req.user._id,

    });

    if (!address) {

        throw new ApiError(404, "Address not found");

    }

    await Address.updateMany(

        {

            user: req.user._id

        },

        {

            $set: {

                isDefault: false

            }

        }

    );

    address.isDefault = true;

    await address.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Default address updated successfully",

            address

        )

    );

});

module.exports = {

    createAddress,

    getAllAddresses,

    getAddressById,

    updateAddress,

    deleteAddress,

    setDefaultAddress,

};