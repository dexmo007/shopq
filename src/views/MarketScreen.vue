<template>
    <div id="screen">
        <div id="q">
            <div id="next-word-wrapper">
                <div id="next-word">Himbeere</div>
                <span>vor 3 Sekunden</span>
            </div>
            <div id="preview">
                <div>
                    <span>1.</span>
                    <div class="preview-anon"></div>
                </div>
                <div>
                    <span>2.</span>
                    <div class="preview-anon"></div>
                </div>
                <div>
                    <span>3.</span>
                    <div class="preview-anon"></div>
                </div>
                <div>
                    <span>4.</span>
                    <div class="preview-app">Rhabarber</div>
                </div>
                <div>
                    <span>5.</span>
                    <div class="preview-anon"></div>
                </div>
                <div>
                    <div id="preview-fade">...</div>
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-market">
                <span id="info-market-name">{{"Rewe"}}</span>
                <span id="info-market-addr">{{"Alte Straße 2"}}</span>
            </div>
            <div id="info-market-text">
                Nur mit Einkaufswagen
            </div>
            <div id="info-general">
                Bitte halten Sie sich an die Hygiene-Richtlinien :)
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MarketScreen.vue",
        props: {
            id: String
        },
    }
</script>

<style>
#nav-account-area{
   display: none;
}
#nav{
    margin-top: 0;
}
#scrollable{
    margin-top: 80px;
    padding-top: 40px;
}
#app, #nav{
    max-width: 90vw;
}
#screen {
    display: flex;
    flex-wrap: wrap;
}
#q{
    flex: 1 1 61.8%;
}
#next-word-wrapper{
    background: var(--warning-color);
    padding: 12px;
    margin: 12px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 120px;
}
#next-word{
    font-size: 4em;
}
#preview > * {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 7px;
    border: 5px solid transparent;
}
#preview > * > span{
    font-size: 4em;
    margin-right: 12px;
}
.preview-anon, .preview-app, #preview-fade{
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 4em;
    flex: 1;
}
#preview > *:first-child{
    border: 5px solid var(--warning-color);
}
.preview-anon {
    background: var(--background-color);
}
.preview-app{
    background: var(--success-color);
}
#preview-fade{
    background: var(--light-background);
    border: 5px solid var(--text-color);
}
#info{
    display: flex;
    flex-direction: column;
    margin-bottom: 12px; /* to match same bottom height with q */
}
#info-market{
    margin: 12px;
    padding: 12px;
    height: 120px;
    font-size: 2.8em;
    display: flex;
    flex-direction: column;
}
#info-market-name{
    font-size: 1.2em;
    font-weight: bold;
}
#info-general, #info-market-text{
    border: 5px solid var(--border-color);
    padding: 12px;
    margin: 12px;
    flex: 1;
    min-height: 180px;
}
</style>