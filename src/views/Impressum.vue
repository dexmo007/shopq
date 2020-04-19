<template>
    <div id="impressum">
        <div id="img" :style="{ backgroundImage: 'url(' + require('@/assets/images/about_bg.jpg') + ')' }">
            <span>Impressum</span>
        </div>
        <font-awesome-icon icon="camera-retro" alt="photo"/> by <a href="https://www.pexels.com/de-de/foto/linie-menschen-schwarz-und-weiss-schwarzweiss-1604200/" target="_blank">pexels.com</a>
        <p>
            #todo
        </p>
    </div>
</template>

<script>
    export default {
        name: "Impressum.vue"
    }
</script>

<style scoped>
    #impressum{
        margin-top: -50px;
    }
    #impressum > p{
        text-align: justify;
        margin: 18px;
        padding-bottom: 24px;
    }
    #img{
        width: 100%;
        height: 380px;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 12px rgb(0, 0, 0);
    }
    #img > span{
        color: white;
        font-size: 2.6em;
        font-weight: bold;
        margin: 18px;
        text-shadow: 0 0 8px rgb(0, 0, 0);
    }
</style>