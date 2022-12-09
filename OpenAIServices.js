import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai";
dotenv.config()


const configuration = new Configuration({
  organization: "org-LaiE47dqcafZFjEVeFFcpAZV",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function searchImage(prompt) {  
  const response = await openai.createImage({
    prompt: prompt,
    n: 2,
    size: "1024x1024",
  })
  
  console.log(response.data)
}


