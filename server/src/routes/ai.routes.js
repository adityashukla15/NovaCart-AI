const express=require('express')

const router=express.Router()

const {
    smartSearch,
}=require('../controllers/ai.controller')

router.post('/search',smartSearch)

module.exports=router