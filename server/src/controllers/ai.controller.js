const groq = require("../services/groq.service");
const aiPrompt = require("../utils/aiPrompt");
const chatPrompt=require("../utils/chatPrompt");
const comparePrompt=require("../utils/comparePrompt");
const summaryPrompt=require("../utils/summaryPrompt");
const outfitPrompt=require("../utils/outfitPrompt");
const imageSearchPrompt=require("../utils/imageSearchPrompt");

const Product = require("../models/product.model");
const Category = require("../models/category.model");

const {saveMessage,getConversationHistory,clearConversation}=require('../services/chat.service')

const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");



// Category Mapping
const categoryMap = {
    sneakers: "Shoes",
    sneaker: "Shoes",
    shoes: "Shoes",
    shoe: "Shoes",
    trainers: "Shoes",
    "running shoes": "Shoes",
    "sports shoes": "Shoes",

    tshirt: "T-Shirts",
    "t-shirt": "T-Shirts",
    tees: "T-Shirts",

    jeans: "Jeans",
    denim: "Jeans",

    hoodie: "Hoodies",
    hoodies: "Hoodies",

    watch: "Watches",
    watches: "Watches",

    bag: "Bags",
    bags: "Bags",
};;

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


const chatWithAI = asyncHandler(async (req, res) => {
    

    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }
// Save user message
await saveMessage(req.user._id, "user", message);

// Load previous conversation
const history = (await getConversationHistory(req.user._id)).map(msg => ({
    role: msg.role,
    content: msg.content,
}));
    // STEP 1 -> Convert user query into filters

    const aiFilterResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: aiPrompt,
            },

            {
                role: "user",
                content: message,
            },

        ],

    });

    let filters;

    try {

        filters = JSON.parse(
            aiFilterResponse.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
        );

    } catch {

        throw new ApiError(500, "AI parsing failed");

    }

    const mongoFilter = {
        isDeleted: false,
    };

    if (filters.brand) {

        mongoFilter.brand = {

            $regex: filters.brand,
            $options: "i",

        };

    }

    if (filters.color) {

        mongoFilter.colors = {

            $regex: filters.color,
            $options: "i",

        };

    }

    if (filters.minPrice || filters.maxPrice) {

        mongoFilter.price = {};

        if (filters.minPrice)
            mongoFilter.price.$gte = filters.minPrice;

        if (filters.maxPrice)
            mongoFilter.price.$lte = filters.maxPrice;

    }

    if (filters.category) {

        const mappedCategory =
            categoryMap[filters.category.toLowerCase()] ||
            filters.category;

        const category = await Category.findOne({

            name: {

                $regex: mappedCategory,

                $options: "i",

            },

        });

        if (category) {

            mongoFilter.category = category._id;

        }

    }

    const products = await Product.find(mongoFilter)

        .populate("category", "name")

        .limit(5);

    // STEP 2 -> Ask AI to explain products

    const aiReply = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.5,

       messages: [

    {
        role: "system",
        content: chatPrompt,
    },

    ...history,

    {
        role: "user",
        content: `
User Query:
${message}

Available Products:

${JSON.stringify(products)}
`,
    },

],
    });

   return res.status(200).json(

    new ApiResponse(

        200,

        "AI Assistant",

        {

            reply: aiReply.choices[0].message.content,

            products,

        }

    )

);

});
const getChatHistory = asyncHandler(async (req, res) => {

    const history = await getConversationHistory(
        req.user._id,
        50
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Chat history fetched successfully",

            history

        )

    );

});

const clearChat = asyncHandler(async (req, res) => {

    await clearConversation(req.user._id);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Conversation cleared successfully"

        )

    );

});

const compareProducts = asyncHandler(async (req, res) => {

    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    // Ask AI to extract product names
    const aiResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: comparePrompt,
            },

            {
                role: "user",
                content: message,
            },

        ],

    });

    let extracted;

    try {

        extracted = JSON.parse(
            aiResponse.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()
        );

    } catch {

        throw new ApiError(500, "AI parsing failed");

    }

    if (
        !extracted.products ||
        extracted.products.length < 2
    ) {
        throw new ApiError(
            400,
            "Please provide at least two product names."
        );
    }

    const regex = extracted.products.map(name => ({
        title: {
            $regex: name,
            $options: "i",
        },
    }));

    const products = await Product.find({

        $or: regex,

        isDeleted: false,

    }).populate("category", "name");

    if (products.length < 2) {
        throw new ApiError(
            404,
            "Products not found."
        );
    }

    // AI Comparison
    const compareResult = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.3,

        messages: [

            {
                role: "system",
                content:
                    "Compare these products in simple language. Mention price, brand, category, strengths, weaknesses, and recommend the best option based only on the provided data.",
            },

            {
                role: "user",
                content: JSON.stringify(products),
            },

        ],

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product comparison completed",

            {
                comparedProducts: products,
                comparison: compareResult.choices[0].message.content,
            }

        )

    );

});

const productSummary = asyncHandler(async (req, res) => {

    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    // Extract product name
    const aiResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: summaryPrompt,
            },

            {
                role: "user",
                content: message,
            },

        ],

    });

    let extracted;

    try {

        extracted = JSON.parse(
            aiResponse.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()
        );

    } catch {

        throw new ApiError(500, "AI parsing failed");

    }

    if (!extracted.product) {
        throw new ApiError(400, "Product not found in prompt.");
    }

    // Search Product
    const product = await Product.findOne({

        title: {
            $regex: extracted.product,
            $options: "i",
        },

        isDeleted: false,

    }).populate("category", "name");

    if (!product) {

        throw new ApiError(
            404,
            "Product not found."
        );

    }

    // AI Summary
    const summary = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.4,

        messages: [

            {
                role: "system",
                content: `
You are an expert shopping assistant.

Summarize the product using ONLY the provided data.

Mention:

- Product Name
- Brand
- Category
- Price
- Discount Price
- Colors
- Sizes
- Best For
- Short Recommendation

Never invent information.
`,
            },

            {
                role: "user",
                content: JSON.stringify(product),
            },

        ],

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Product summary generated",

            {

                product,

                summary: summary.choices[0].message.content,

            }

        )

    );

});

const outfitRecommendation = asyncHandler(async (req, res) => {

    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    // ==============================
    // STEP 1 -> AI Extract Outfit Filters
    // ==============================

    const aiResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: outfitPrompt,
            },

            {
                role: "user",
                content: message,
            },

        ],

    });

    let filters;

    try {

        filters = JSON.parse(

            aiResponse.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

        );

    } catch {

        throw new ApiError(500, "AI returned invalid JSON");

    }

    // ==============================
    // STEP 2 -> Search Products
    // ==============================

    const outfit = {};

    for (const categoryName of filters.categories) {

        const mappedCategory =
            categoryMap[categoryName.toLowerCase()] ||
            categoryName;

        const category = await Category.findOne({

            name: {

                $regex: `^${mappedCategory}$`,
                $options: "i",

            }

        });

        if (!category) continue;

        const mongoFilter = {

            category: category._id,

            isDeleted: false,

        };

        // Budget
        if (filters.budget && filters.budget > 0) {

            mongoFilter.discountPrice = {

                $lte: filters.budget,

            };

        }

        // Color
        if (filters.color) {

            mongoFilter.colors = {

                $regex: filters.color,

                $options: "i",

            };

        }

        const product = await Product.findOne(mongoFilter)

            .sort({

                rating: -1,

                discountPrice: 1,

            })

            .populate("category", "name");

        if (product) {

            outfit[category.name] = product;

        }

    }

    let totalPrice = 0;

Object.values(outfit).forEach((product) => {

    totalPrice += product.discountPrice || product.price;

});

    // ==============================
    // STEP 3 -> AI Recommendation
    // ==============================

    const recommendation = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.4,

        messages: [

            {

                role: "system",

                content: `
You are an AI Fashion Stylist.

Recommend the outfit using ONLY the provided products.

Mention:

- Why this outfit is good
- Which occasion it suits
- Style tips
- Total Outfit Overview

Never invent products.

Keep the response friendly.
`

            },

            {

                role: "user",

                content:

`User Query:

${message}

Selected Outfit:

${JSON.stringify(outfit)}
`

            }

        ]

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Outfit recommendation generated",

            {

                filters,

                outfit,

                recommendation:
                    recommendation.choices[0].message.content,

            }

        )

    );

});

const imageSearch = asyncHandler(async (req, res) => {

    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    // ==========================
    // AI Extract Filters
    // ==========================

    const aiResponse = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0,

        messages: [

            {
                role: "system",
                content: imageSearchPrompt,
            },

            {
                role: "user",
                content: message,
            },

        ],

    });

    let filters;

    try {

        filters = JSON.parse(

            aiResponse.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

        );

    } catch {

        throw new ApiError(500, "AI returned invalid JSON");

    }

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

    // Category

    if (filters.category) {

        const mappedCategory =
            categoryMap[filters.category.toLowerCase()] ||
            filters.category;

        const category = await Category.findOne({

            name: {

                $regex: `^${mappedCategory}$`,

                $options: "i",

            }

        });

        if (category) {

            mongoFilter.category = category._id;

        }

    }

    // Search Products

    const products = await Product.find(mongoFilter)

        .populate("category", "name")

        .select("title images price discountPrice brand colors category")

        .limit(20);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Image search completed",

            {

                filters,

                totalResults: products.length,

                products,

            }

        )

    );

});

module.exports = {
    smartSearch,
    chatWithAI,
    getChatHistory,
    clearChat,
    compareProducts,
    productSummary,
    outfitRecommendation,
    imageSearch,
    
};