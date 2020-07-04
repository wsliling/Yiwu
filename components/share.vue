<template>
<div>
    <button open-type="share" @click="share">
        <slot>
            分享
        </slot>
    </button>
</div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        share(e){
            console.log(e)
        }
    }
}
</script>