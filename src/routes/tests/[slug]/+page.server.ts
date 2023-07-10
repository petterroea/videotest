import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    try {
        const data = await(await fetch(`/${params.slug}/manifest.json`)).json()
        console.log(`Explanation dir: ${data.explanation}`)
        const explanation = await(await fetch(`/${params.slug}/${data.explanation}`)).text()

        const shuffledFiles = data.files.sort((a, b) => 0.5 - Math.random())
        console.log(`Shuffled files: ${shuffledFiles}`)

        return {
            metadata: { 
                ...data,
                explanation,
                // Shuffle the tests
                files: shuffledFiles
            },
            slug: params.slug
        }
    } catch (e) {
        console.log(e)
        throw error(404, "Manifest not found");
    }
}