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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    console.log("request", req.method);
    if (req.method === 'POST') {
        const json = req.body as InputData;
        console.log(json)

        const supabase = createClient('https://heinegxlzmatuyvslqnz.supabase.co', process.env.key);
        const { error } = await supabase
            .from('benchmark')
            .insert(json);

        if (error) {
            return res.status(500).json({ message: error.details });
        }
        return res.status(200).json({ message: 'saved' });

    } else {
        return res.status(404);
    }
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
