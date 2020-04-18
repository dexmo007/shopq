<template>
    <div id="about">
        <div id="img" :style="{ backgroundImage: 'url(' + require('@/assets/images/about_bg.jpg') + ')' }">
            <span>shopQ ist ein kostenloses Managementsystem für Warteschlangen vor Geschäften</span>
        </div>
        <p>
        Wollen Sie überwachen, wie viele Leute gleichzeitig im Laden sind und wann Sie neue Kunden in ihr Geschäft lassen können?<br>
        Kein Problem!<br> Über diese App können sich Kunden schon bequem von zu Hause aus für ihr Geschäft anstellen.
        Vermeiden sie Warteschlangen und dadurch zusätzliche Begegnungen mit anderen Menschen.</p>
    </div>
</template>

<script>
    export default {
        name: "About.vue"
    }
</script>

<style scoped>
#about{
    margin-top: -50px;
}
#img{
    width: 100%;
    height: 380px;
    background:  no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 12px rgb(0, 0, 0);
}
#img > span{
    background: #2c3e50;
    color: white;
    font-size: 1.2em;
    padding: 8px 20px;
    margin: 18px;
    text-shadow: 0 0 2px rgb(0, 0, 0);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.42);
}
#about > p{
    text-align: justify;
    margin: 18px;
    padding-bottom: 24px;
}
</style>