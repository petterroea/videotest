import fs from "node:fs";
import { error } from '@sveltejs/kit';

const outputPath = process.env.OUTPUT_PATH;

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.json()
    console.log(`Received: ${JSON.stringify(data)}`)
    // Contents
    const slug = data.slug
    const testData = data.data
    if(!slug) {
        throw error(400, "no slug")
    }

    const submissionName = crypto.randomUUID();

    const putDir =`${outputPath}/${slug}`

    if (!fs.existsSync(putDir)){
        fs.mkdirSync(putDir);
    }

    const path = `${putDir}/${submissionName}.json`

    fs.writeFileSync(path, JSON.stringify(testData));

    console.log("Successfully wrote file")
    return new Response("ok")
}