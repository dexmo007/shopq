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
        <progress-bar :threshold="maxPeopleInStore" :count="peopleInStore"/>
        <span>(#1) Anzeige</span>
        <p>#1 zeigt an, wie viele Leute im (hier fiktiven) Geschäft sind. Zur Zeit halten sich 2 Kunden in den Räumlichkeiten auf.</p>
        <div>
            <button class="success" @click="peopleInStore++">Kunde kommt</button>
            <button class="danger" @click="peopleInStore--">Kunde geht</button>
        </div>
        <div v-if="peopleInStore > maxPeopleInStore">
            <button class="info">Kunde zur Warteschlange hinzufügen</button>
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
            peopleInStore: 2
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
    color: #ffffff;
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
</style>