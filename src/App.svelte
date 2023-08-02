<script lang="ts">
    import { postFigma } from "$lib/util.ts";
    import { Textarea, Button, Label, Input, Checkbox, SectionTitle } from "figsvelte";
    let hasDelimiter = false;
    let hasPrefix = false;
    let data = "";
    let delimiter = ",";
    let prefix = "";

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    }
    function handleClick() {
        let selDelimiter = ",";

        if (hasDelimiter) {
            if (delimiter === "\\t") {
                selDelimiter = "\t";
            } else if (delimiter === "\\n") {
                selDelimiter = "\n";
            } else {
                selDelimiter = delimiter;
            }
        }

        let urlAry = data.split(selDelimiter);
        if (hasPrefix) urlAry = urlAry.map((e) => prefix.trim() + e.trim());
        
        // Filter out valid URL
        urlAry = urlAry.filter((e) => isValidURL(e));
        postFigma(urlAry);
    }
</script>

<main>
    <SectionTitle>URLs</SectionTitle>

    <Textarea bind:value={data} class="flex-grow" placeholder="Enter the url seperated by the comma" />

    <section>
        <Checkbox bind:checked={hasDelimiter}>Cutom delimiter</Checkbox>
        {#if hasDelimiter}
            <Input borders bind:value={delimiter} placeholder="Enter the delimiter" />
        {/if}
    </section>

    <section>
        <Checkbox bind:checked={hasPrefix}>Base URL prefix</Checkbox>
        {#if hasPrefix}
            <Input borders bind:value={prefix} placeholder="Enter the prefix" />
        {/if}
    </section>

    <Button on:click={handleClick} class="mt-xsmall">Import Images</Button>
</main>

<style>
    main {
        padding: 0 var(--figma-size-xsmall) var(--figma-size-xsmall);
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
