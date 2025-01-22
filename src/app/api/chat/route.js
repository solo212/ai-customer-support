import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { query } = body;

        if (!query) {
            return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
        }

        // OpenAI API call
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful customer support assistant." },
                { role: "user", content: query },
            ],
            max_tokens: 50,
        });

        return new Response(
            JSON.stringify({ response: completion.choices[0].message.content.trim() }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), { status: 500 });
    }
}

