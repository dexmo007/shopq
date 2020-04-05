<template>
    <div id="information" :class="variant" @mouseover="isShown = true" @mouseleave="isShown = !unfold">
        <h1 v-if="title">{{title}}</h1>
        <slot v-if="isShown"/>
    </div>
</template>

<script>
    export default {
        name: "InformationBox.vue",
        props: {
            variant: {
                type: String,
                default: "info"
            },
            title: {
                type: String,
                default: null,
            },
            unfold: {
                type: Boolean,
                default: true
            }
        },
        mounted(){
            if(!this.unfold) {
                this.isShown = true;
            }
        },
        data() {
            return {
                isShown: false
            }
        }
    }
</script>

<style scoped>
#information{
    border: 5px solid #f8ac59;
    border-radius: 5px;
    text-align: initial;
    padding: 5px;
}
</style>