<template>
    <span>{{timeString}}</span>
</template>

<script>
    import {selectUnit} from "@formatjs/intl-utils";

    export default {
        name: "HumanReadableTime",
        props: {
            time: {
                type: Date,
                default: () => {new Date()}
            }
        },
        data(){
            return {
                timeString: "irgendwie, irgendwo, irgendwann",
                rtf: new Intl.RelativeTimeFormat("de", { numeric: "auto" })
            }
        },
        mounted() {
            this.updateTimeString();
        },
        watch: {
            time(){ this.updateTimeString() }
        },
        methods: {
            updateTimeString(){
                const ts = new Date(this.time);
                const diff = selectUnit(ts);

                switch(diff.unit) {
                    case "second":
                        setTimeout(this.updateTimeString, 1000);
                        this.timeString = "vor einigen Sekunden";
                        return;
                    case "minute":
                        setTimeout(this.updateTimeString, 1000 * 60);
                        break;
                    case "hour":
                        setTimeout(this.updateTimeString, 1000 * 60 * 60);
                        break;
                    default:
                    // no need to update the timeString anymore
                }

                this.timeString = this.rtf.format(diff.value, diff.unit);
            }
        }
    }
</script>

<style scoped>

</style>