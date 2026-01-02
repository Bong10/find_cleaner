import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for Find Cleaner, a platform that connects clients with professional cleaning services. 

Key information about Find Cleaner:
- We offer various cleaning services: house cleaning, deep cleaning, commercial cleaning, end-of-tenancy cleaning
- We have verified professional cleaners available for booking
- We offer FREE professional cleaning training courses covering: Deep Cleaning, End-of-Tenancy Standards, Hygiene & Safety, Handling Chemicals (COSHH), Professional Conduct, Customer Service, Time Management, and Housekeeping Standards
- Our platform allows clients to browse cleaners, check reviews, and book services directly
- Cleaners can register, complete training, and offer their services

Your role:
- Help users understand our services and courses
- Guide them on how to book a cleaner or register as a cleaner
- Answer questions about cleaning techniques and standards
- Be friendly, professional, and concise
- If asked about pricing, explain that it varies by cleaner, service type, and location
- Encourage users to explore our free training courses if they're interested in becoming professional cleaners`;

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Format conversation history for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content;

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
