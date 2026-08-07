const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const router=express.Router()

const {
    smartSearch,chatWithAI,clearChat,getChatHistory,compareProducts,productSummary,outfitRecommendation,imageSearch
}=require('../controllers/ai.controller')

router.post('/search',smartSearch)
router.post('/chat',authMiddleware,chatWithAI)
router.get('/history',authMiddleware,getChatHistory)
router.delete('/clear',authMiddleware,clearChat)
router.post('/compare',authMiddleware,compareProducts)
router.post('/summary',authMiddleware,productSummary)
router.post('/outfit-recommendation',authMiddleware,outfitRecommendation)
router.post('/image-search',authMiddleware,imageSearch)
module.exports=router