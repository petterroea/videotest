<script>
    /** @type {import('./$types').PageData} */
    export let data;

    import Card from "@smui/card";
    import Button from "@smui/button";
    import Slider from "@smui/slider";

    import { Circle } from "svelte-loading-spinners";

    import SvelteMarkdown from 'svelte-markdown'

    import VideoPlayer from "../../../lib/videoPlayer.svelte"

    const States = {
        LOBBY: 0,
        TUTORIAL: 1,
        TEST: 2,
        SUBMIT: 3,
        DONE: 4
    }

    let screenSize;

    let state = States.LOBBY;

    let progress = 0;
    let canProceed = false;
    let submitting = false;
    let selectedValue = 1;

    let testData = {

    }

    const getVideoPath = (path) => {
        if(path.startsWith("/")) {
            return path;
        }
        return `/${data.slug}/${path}`
    }

    const submitData = async () => {
        await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "slug": data.slug,
                "data": testData
            })
        })
        state = States.DONE;
    }

    console.log(data);
</script>

<svelte:window bind:innerWidth={screenSize} />
{#if screenSize < data.metadata.min_screen_size}
    <article>
        <div class="container">
            <Card padded>
                <h1>Invalid browser</h1>
                <p>Sorry, you cannot participate in this test using this device.</p>
                <p>You need a wider monitor. Try participating from a laptop</p>
            </Card>
        </div>
    </article>
{:else}
    <article>
        {#if state == States.LOBBY}
            <div class="container">
                <Card padded>
                    <h1>{ data.metadata.title }</h1>
                    <p><i>By { data.metadata.author}</i></p>
                    <p>Questions: {data.metadata.contact}</p>

                    <SvelteMarkdown source={data.metadata.explanation} />
                    <Button variant="outlined" on:click={() => state = States.TUTORIAL}>Continue</Button>
                </Card>
            </div>
        {:else if state == States.TUTORIAL}
            <div class="wide">
                <Card padded>
                    <h1>Training ({progress+1} out of {data.metadata.training.length}): {data.metadata.training[progress].title}</h1>
                    <p>{data.metadata.training[progress].description}</p>

                    <VideoPlayer onVideoFinish={() => canProceed = true} src={getVideoPath(data.metadata.training[progress].file)} />

                    {#if canProceed}
                        <Button variant="outlined" on:click={() => {
                            if(progress == data.metadata.training.length-1) {
                                progress = 0;
                                state = States.TEST;
                            } else {
                                progress++;
                            }
                            canProceed = false; // TODO change
                        }}>Continue</Button>
                    {/if}
                </Card>
            </div>
        {:else if state == States.TEST}
            <div class="wide">
                <Card padded>
                    <h1>Experiment ({progress+1} out of {data.metadata.files.length}, {Math.round((progress/data.metadata.files.length)*100)}% complete)</h1>
                    <VideoPlayer onVideoFinish={() => canProceed = true} src={getVideoPath(data.metadata.files[progress])} />
                    {#if canProceed}
                        <div class="compressionSliderContainer">
                            <span>{ data.metadata.range.min_label }</span>
                            <Slider class="slider" style="flex-grow: 1; width: 100%;" bind:value={selectedValue} min={1} max={data.metadata.range.max_range}/>
                            <span>{ data.metadata.range.max_label }</span>
                        </div>
                        <!--<p class="selectedLabel">Selected: {selectedValue}</p>-->
                        <Button variant="outlined" on:click={() => {
                            testData[data.metadata.files[progress]] = selectedValue;

                            if(progress == data.metadata.files.length-1) {
                                state = States.SUBMIT;
                            } else {
                                progress++;
                            }
                            selectedValue = 1;
                            canProceed = false; // TODO change
                        }}>Continue</Button>
                    {/if}
                </Card>
            </div>
        {:else if state == States.SUBMIT}
            <div class="container">
                <Card padded>
                    <h1>Submit</h1>
                    <p>The experiment portion is over. Click the button below to submit the results</p>
                    {#if submitting}
                        <Circle />
                    {:else}
                        <Button variant="unelevated" on:click={() => {
                            submitting = false;
                            submitData();
                        }}>Submit data</Button>
                    {/if}
                </Card>
            </div>
        {:else if state == States.DONE}
            <div class="container">
                <Card padded>
                    <h1>Thank you</h1>
                    <p>The experiment is over. You may now close your web browser. Thank you for your participation!</p>
                    <p>Questions? {data.metadata.contact}</p>
                </Card>
            </div>
        {/if}
    </article>
{/if}

<style>
    article {
        display: flex;
        justify-content: center;
    }
    :global(.mdc-slider__input) {
        width: 100%; /* hack */
    }
    .selectedLabel {
        width: 100%;
        text-align: center;
    }
    .compressionSliderContainer {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .compressionSliderContainer > span {
        display: block;
        padding: 1em;
        text-align:center;
        width: 10em;
    }
    .wide {
        max-width: 1300px;
    }
    .container {
        max-width: 960px;
    }
</style>