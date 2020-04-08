<template>
    <div :class="{...variant, 'visible': isShown}" @mouseover="isShown = true" id="information">
        <span id="title" v-if="title">{{title}}</span>
        <transition name="show">
            <slot id="content" v-if="isShown"/>
        </transition>
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
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    text-align: initial;
    transition: border 350ms cubic-bezier(0.43, 0, 0.37, 0.94);
    width: auto;
    height: auto;
}
#information.visible{
    border: 5px solid #f8ac59;
}
#information > #title{
    background: #f8ac59;
    padding: 0.2em 0.6em;
    border-radius: 5px;
    text-align: center;
}
#information.visible > #title{
    border-radius: 0;
}
#information > #content{
    margin: 5px;
}
.show-enter-active, .show-leave-active {
    transition: width, height 350ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
.show-enter, .show-leave-to {
    width: 0;
    height: 0;
}
.show-enter-to, .show-leave{
    width: auto;
    height: auto;
}
</style>