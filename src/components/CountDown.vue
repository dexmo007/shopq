<template>
    <div :class="{danger: critical}">
        <span>{{min}}</span>:<span>{{sec}}</span>
    </div>
</template>

<script>
    export default {
        name: "CountDown.vue",
        props : {
            endDate : {  // pass date object till when you want to run the timer
                type : Date,
                default(){
                    return new Date()
                }
            },
            negative : {  // optional, should countdown after 0 to negative
                type : Boolean,
                default : false
            }
        },
        data(){
            return{
                now : new Date(),
                critical: null,
                timer : null
            }
        },
        computed:{
            min(){
                let m = Math.trunc((this.endDate - this.now) / 1000 / 60) % 60;
                return m>9?m:'0'+m;
            },
            sec(){
                let s = Math.trunc((this.endDate - this.now)/1000) % 60
                return s>9?s:'0'+s;
            }
        },
        mounted(){
            if(this.endDate - new Date() < 2 * 60 * 1000){
                this.critical = false;
            }
        },
        watch : {
            endDate : {
                immediate : true,
                handler(newVal){
                    if(this.timer){
                        clearInterval(this.timer)
                    }
                    this.timer = setInterval(()=>{
                        this.now = new Date();
                        if(this.negative){
                            return;
                        }
                        if(this.endDate - new Date() < 2 * 60 * 1000 && this.critical !== false){
                            this.critical = true;
                        }
                        if(this.now > newVal){
                            this.now = newVal;
                            this.$emit('end-timer');
                            clearInterval(this.timer)
                        }
                    }, 1000)
                }
            }
        },
        beforeDestroy(){
            clearInterval(this.timer);
            this.critical = false;
        }
    }
</script>

<style scoped>
.danger{
    color: #dd363a;
}
</style>