<script>
    import Button from "@smui/button";

    export let src = "";
    export let onVideoFinish;

    let videoPlayer;

    const playVideo = () => {
        videoPlayer.play();
    }
</script>

<video src={src} bind:this={videoPlayer} on:ended={onVideoFinish} type="video/mp4" />
<div class="buttonContainer">
    <Button variant="outlined" on:click={playVideo}>Play</Button>
</div>

<style>
    .buttonContainer {
        width: 100%;
        display: flex;
        flex-direction: column;

        margin-top: 1em;
        gap: 1em;
    }
</style>