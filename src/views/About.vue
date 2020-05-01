<template>
    <div id="about">
        <div id="img" :style="{ backgroundImage: 'url(' + require('@/assets/images/about_bg.jpg') + ')' }">
            <span>shopQ ist ein kostenloses Managementsystem für Warteschlangen vor Geschäften</span>
        </div>
        <p>
        Wollen Sie überwachen, wie viele Leute gleichzeitig im Laden sind und wann Sie neue Kunden in ihr Geschäft lassen können?<br>
        Kein Problem!<br> Über diese App können sich Kunden schon bequem von zu Hause aus für ihr Geschäft anstellen.
        Vermeiden sie Warteschlangen und dadurch zusätzliche Begegnungen mit anderen Menschen.</p>
        <h1>Wollen Sie shopQ ausprobieren?</h1>
        <p>Sie suchen ihren Supermarkt um die Ecke auf shopQ und finden diese Übersicht:</p>
        <div v-if="capacityReached">
            <button
                    class="success"
                    id="joinQ-btn"
                    @click="addToQ()"
            >virtuell anstellen</button>
            <span v-if="q.length === 0">Sei der erste in der Schlange!</span>
            <span v-else><b>{{q.length}}</b> Personen in der Schlange</span>
        </div>
        <div v-else>
            <h2>Es gibt keine Schlange!</h2>
            <span>Sie können zur Zeit ohne anzustehen einkaufen gehen,</span><br>
            <span>es {{freeSlots === 1 ? 'ist ein Platz' : `sind ${freeSlots} Plätze`}} frei!</span>
        </div>

       <div><!-- #todo add hr line, but not <hr>--></div>

        <progress-bar :threshold="maxPeopleInStore" :count="peopleInStore"/>
        <span>(#1) Anzeige</span>
        <p>#1 zeigt an, wie viele Leute im Geschäft sind. Zur Zeit halten sich {{peopleInStore}} Kunden in den Räumlichkeiten auf.</p>
        <div id="marketAdmittance-interaction">
            <button class="success" @click="peopleInStore++">Kunde kommt</button>
            <button class="danger" @click="peopleInStore--">Kunde geht</button>
        </div>
        <div v-if="capacityReached">
            <button class="info" @click="addToQ()">Kunde zur Warteschlange hinzufügen</button>
        </div>
    </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar";
export default {
    name: "About.vue",
    components: {ProgressBar},
    data() {
        return {
            maxPeopleInStore: 5,
            peopleInStore: 2,
            q: []
        }
    },
    computed: {
        capacityReached(){
          return this.peopleInStore >= this.maxPeopleInStore;
        },
        freeSlots(){
          return this.maxPeopleInStore - this.peopleInStore;
        }
    },
    methods: {
        addToQ(){

        }
    }
}
</script>

<style scoped>
#about{
    margin-top: -50px;
}
#img{
    width: calc(100% + 1px);
    height: 380px;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 12px rgb(0, 0, 0);
}
#img > span{
    color: var(--text-bright-color);
    font-weight: bold;
    font-size: 1.4em;
    padding: 18px;
    margin: 40px;
    text-shadow: 0 0 9px rgb(0, 0, 0);
    border-radius: 5px;
}
#about > p{
    text-align: justify;
    margin: 18px;
    padding-bottom: 24px;
}
#progress{
    margin: 18px;
    width: auto;
}
#marketAdmittance-interaction{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 18px;
}
</style>