import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js';

type ResponseData = {
    message: string
}

type InputData = {
    model: string,
    cpu: string,
    platform: string,
    userAgent: string,
    hardwareConcurrency: number,
    time: number
}

export async function POST(
    req: Request
) {
    const json = await req.json() as InputData;
    console.log(json)

    if (!(json.model && json.cpu)) {
        return new Response(null, {
            status: 500,
            statusText: "No model or cpu set",
        });
    }

    if (!json.time) {
        return new Response(null, {
            status: 500,
            statusText: "No time set",
        });
    }

    const supabase = createClient('https://heinegxlzmatuyvslqnz.supabase.co', process.env.key);
    const { error } = await supabase
        .from('benchmark')
        .insert(json);

    if (error) {
        return new Response(null, {
            status: 500,
            statusText: error.details,
        });
    }
    return Response.json({ message: 'saved' });
}
