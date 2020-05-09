<template>
    <div id="q">
        <div id="next-word-wrapper" v-if="lastEntry">
            <div id="next-word">{{lastEntry.word}}</div>
            <span>{{lastEntry.ts}}</span>
        </div>
        <div id="preview">
            <div v-if="fadeStart">
                <div class="preview-fade">...</div>
            </div>
            <div v-for="(word) in wordList"
                 :key="word.realIndex"
                 :class="{highlight: highlightWord != null && word.ticketCode === highlightWord.word}">
                <span>{{word.realIndex + 1}}.</span>
                <div class="preview-anon" v-if="word.type === 'ANON'"></div>
                <div class="preview-app" v-else>{{word.ticketCode}}</div>
            </div>
            <div v-if="fadeEnd">
                <div class="preview-fade">...</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Queue",
        props: {
            qList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            /* users word (for /market, to show users position in q) or */
            highlightWord: {
                type: Object,
                default: function () {
                    return null; /* {word: "Rhabarbar",
                        ts: "vor 3 Sekunden"} */
                }
            },

            /* last one entered the store (for MarketScreen) */
            lastEntry: {
                type: Object,
                default: function () {
                    return null;/*{word: "Sellerie",
                        ts: "vor 3 Sekunden"} */
                }
            },
            limit: {
                type: Number,
                default: 5
            }
        },
        computed: {
            wordList: function () {
                let center = 0;
                const qLength = this.qList.length;
                let list = this.qList;
                list.forEach((item, i) => {
                    item.realIndex = i;
                });

                if(qLength < 5){
                    return list;
                }
                if(!this.highlightWord) {
                    return list.slice(0,5);
                }else{
                    center = list.findIndex((element) => element.ticketCode === this.highlightWord.word);
                    console.log(center);
                    console.log(list);
                    if(center === 0){
                        return list.slice(1,6);
                    }
                    if(center < 2) {
                        return list.slice(0,5);
                    }
                    if(center + 3 > qLength){
                        return list.slice(qLength - 5, qLength);
                    }
                    return list.slice(center - 2, center + 3);
                }

            }
        },
        mounted(){

        },
        data() {
            return {
                fadeStart: false,
                fadeEnd: false
            }
        }
    }
</script>

<style scoped>
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

    #preview > .highlight{
        border: 5px solid var(--warning-color);
    }
    .preview-anon {
        background: var(--background-color);
    }
    .preview-app{
        background: var(--success-color);
    }
    .preview-fade{
        background: var(--light-background);
        border: 5px solid var(--text-color);
    }
</style>