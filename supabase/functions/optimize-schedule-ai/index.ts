import "https://deno.land/x/xhr@0.1.0/mod.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, selectedCourses, allCourses } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const systemPrompt = `You are an intelligent course scheduling assistant chatbot. You can:
1. Answer questions about available courses, times, and instructors
2. Help users explore course options before adding them to their schedule
3. Make schedule optimization suggestions when users have courses selected
4. Provide helpful information and advice

Course data structure:
- course_code: e.g., "CPSC 110"
- section: e.g., "101", "L1A" (lectures start with numbers, labs with "L", tutorials with "T")
- days: array of days the course meets (e.g., ["MON", "WED", "FRI"])
- time_start: start time in HH:MM format
- time_end: end time in HH:MM format
- instructor: instructor name
- status: course status (e.g., "Full", "Available")

When responding:
1. For general questions: Search through available courses and provide helpful answers
2. For schedule optimization: Only suggest changes if user has courses in their schedule

Response format (valid JSON only, no markdown):
{
  "response": "Your conversational response here",
  "changes": [
    {
      "courseCode": "CPSC 110",
      "oldSection": "101",
      "newSection": "102",
      "reason": "Brief reason"
    }
  ]
}

If only answering (no changes needed):
{
  "response": "Your answer here",
  "changes": []
}

Rules:
- Be conversational and helpful
- Answer questions about courses even when user has no schedule
- When suggesting changes, only suggest sections that exist in allCourses
- Match course codes exactly
- Preserve course types (lecture/lab/tutorial)
- Consider time conflicts
- Keep responses concise but friendly
- If user has no courses selected, focus on helping them explore options`;

    // Convert chat messages to API format
    const apiMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.role === 'user'
        ? msg.content
        : msg.content
    }));

    // Add context about current schedule and available courses
    const hasSchedule = selectedCourses && selectedCourses.length > 0;
    const contextMessage = {
      role: 'user',
      content: hasSchedule
        ? `Current schedule context:
Selected courses: ${JSON.stringify(selectedCourses, null, 2)}

Available courses: ${JSON.stringify(allCourses.slice(0, 100), null, 2)}
(showing first 100 courses for context)

Please respond to my latest message.`
        : `User has no courses selected yet. Here are available courses to help answer their question:

Available courses: ${JSON.stringify(allCourses.slice(0, 150), null, 2)}
(showing first 150 courses for context)

Please respond to my latest message about available courses.`
    };

    console.log('Calling Lovable AI for schedule chat...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...apiMessages,
          contextMessage
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse the AI response
    let result;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) ||
        aiResponse.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('AI returned invalid JSON response');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in optimize-schedule-ai function:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      response: 'Sorry, I encountered an error. Please try again.',
      changes: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
