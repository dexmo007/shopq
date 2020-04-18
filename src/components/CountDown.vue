<template>
    <div id="count-down" :class="{danger: critical}" :style="{ background: 'linear-gradient(\n'+
'          rgba(0, 0, 0, 0.28), \n'+
'          rgba(0, 0, 0, 0.42)\n'+
'        ),url(' + require('@/assets/images/about_bg.jpg') + ')' }" v-if="running">
        <span>
            <span>{{min}}</span>:<span>{{sec}}</span>
        </span>
        <span style="font-size: 1rem">verbleibende Zeit</span>
    </div>
    <div v-else>
        over
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
                timer : null,
                running: true
            }
        },
        computed:{
            min(){
                let m = Math.trunc((this.endDate - this.now) / 1000 / 60) % 60;
                return m>9?m:'0'+m;
            },
            sec(){
                let s = Math.trunc((this.endDate - this.now)/1000) % 60;
                return s>9?s:'0'+s;
            }
        },
        mounted(){
            if(this.endDate - new Date() < 0){
                this.running = false;
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
                            this.running = false;
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
    border: 8px solid #dd363a !important;
    box-shadow:
        inset 0 0 23vmin rgb(0, 0, 0),
        0 0 8px rgba(0, 0, 0, 0.4) !important;
}
#count-down{
    background: #2c3e50;
    background-size: cover !important;
    color: white;
    height: 240px;
    width: 240px;
    margin: 32px auto;
    border-radius: 50%;
    border: 8px solid rgba(0,0,0,0.75);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    box-shadow: inset 0 0 15px rgb(0, 0, 0);
    text-shadow: 0 0 6px rgb(0, 0, 0);
    transition: border, box-shadow 280ms cubic-bezier(0.43, 0, 0.37, 0.94);
}
</style>