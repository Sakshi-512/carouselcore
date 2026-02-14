import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { topic, keyPoints } = await request.json();
    
    const prompt = `Create a 6-slide LinkedIn carousel about: "${topic}"

${keyPoints ? `Key points to cover: ${keyPoints}` : ''}

Format your response as JSON with this exact structure:
{
  "slides": [
    {
      "number": 1,
      "type": "title",
      "heading": "Eye-catching title here",
      "content": "Brief engaging subtitle"
    },
    {
      "number": 2,
      "type": "content",
      "heading": "First main point",
      "content": "2-3 short bullet points explaining this"
    },
    {
      "number": 3,
      "type": "content", 
      "heading": "Second main point",
      "content": "2-3 short bullet points explaining this"
    },
    {
      "number": 4,
      "type": "content",
      "heading": "Third main point", 
      "content": "2-3 short bullet points explaining this"
    },
    {
      "number": 5,
      "type": "content",
      "heading": "Fourth main point",
      "content": "2-3 short bullet points explaining this"
    },
    {
      "number": 6,
      "type": "cta",
      "heading": "Key takeaway or call to action",
      "content": "Final motivating message"
    }
  ]
}

Make it:
- Professional and engaging
- Each slide should be concise (max 50 words)
- Use clear, actionable language
- Make slide 1 attention-grabbing
- Make slide 6 memorable

Return ONLY valid JSON, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional content creator specializing in viral LinkedIn carousels. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate carousel', details: error.message },
      { status: 500 }
    );
  }
}