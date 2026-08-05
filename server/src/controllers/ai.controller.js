const groq = require("../services/groq.service");
const aiPrompt = require("../utils/aiPrompt");

const Product = require("../models/product.model");
const Category = require("../models/category.model");

const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// Category Mapping
const categoryMap = {
    sneakers: "Shoes",
    shoe: "Shoes",
    shoes: "Shoes",
    "running shoes": "Shoes",
    "sports shoes": "Shoes",
    trainers: "Shoes",

    tshirt: "T-Shirts",
    "t-shirt": "T-Shirts",
    tees: "T-Shirts",

    denim: "Jeans",
};

const smartSearch = asyncHandler(async (req, res) => {

    const { query } = req.body;

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    // Ask AI
    const aiResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: aiPrompt,
            },

            {
                role: "user",
                content: query,
            },

        ],

    });

    let content = aiResponse.choices[0].message.content.trim();

    // Remove ```json
    content = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let filters;

    try {

        filters = JSON.parse(content);

    } catch (err) {

        console.log(content);

        throw new ApiError(
            500,
            "AI returned invalid JSON"
        );

    }

    // Mongo Filter
    const mongoFilter = {

        isDeleted: false,

    };

    // Brand
    if (filters.brand) {

        mongoFilter.brand = {

            $regex: filters.brand,

            $options: "i",

        };

    }

    // Color
    if (filters.color) {

        mongoFilter.colors = {

            $regex: filters.color,

            $options: "i",

        };

    }

    // Price
    if (filters.minPrice || filters.maxPrice) {

        mongoFilter.price = {};

        if (filters.minPrice) {

            mongoFilter.price.$gte = Number(filters.minPrice);

        }

        if (filters.maxPrice) {

            mongoFilter.price.$lte = Number(filters.maxPrice);

        }

    }

    // Category
    if (filters.category) {

        const mappedCategory =
            categoryMap[filters.category.toLowerCase()] ||
            filters.category;

        const category = await Category.findOne({

            name: {

                $regex: `^${mappedCategory}$`,

                $options: "i",

            },

        });

        if (category) {

            mongoFilter.category = category._id;

        }

    }

    console.log("AI Filters =>", filters);
    console.log("Mongo Filter =>", mongoFilter);

    let products = await Product.find(mongoFilter)
        .populate("category", "name slug")
        .limit(20);

    // Optional keyword ranking (NOT filtering)
    if (
        filters.keywords &&
        filters.keywords.length > 0
    ) {

        const regex = new RegExp(
            filters.keywords.join("|"),
            "i"
        );

        products.sort((a, b) => {

            const aScore =
                regex.test(a.title) ||
                regex.test(a.description);

            const bScore =
                regex.test(b.title) ||
                regex.test(b.description);

            return bScore - aScore;

        });

    }

    console.log("Products Found =>", products.length);

    return res.status(200).json(

        new ApiResponse(

            200,

            "AI Search completed",

            {

                filters,

                totalProducts: products.length,

                products,

            }

        )

    );

});

module.exports = {
    smartSearch,
};