require("dotenv").config();

const groq = require("../server/src/services/groq.service");

async function test() {

    const response = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [

            {
                role: "user",
                content: "Say Hello",
            },

        ],

    });

    console.log(response.choices[0].message.content);

}

test();