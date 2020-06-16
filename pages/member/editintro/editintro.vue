<template>
  <view class="editpage">
      <view class="intro">
      	<textarea v-model="intro" placeholder="请输入你的简介" />
      </view>
      <view class="btn" @click="EditUserNick">确定</view>
  </view>
</template>

<script>
import {post,get,toLogin} from '@/common/util.js';
export default {
  data () {
    return {
      userId:"",
      token:"",
      intro:""
    }
  },
  onLoad(e){
    this.userId = uni.getStorageSync("userId")
    this.token = uni.getStorageSync("token")
    this.intro=e.text;
  },
  methods: {
    //编辑简介
    EditUserNick(){
      if(this.intro){
        post('User/EditUserNick',{
          UserId:this.userId,
          Token:this.token,
          UserNick:this.intro
        }).then(res=>{
          uni.showToast({
            title: res.msg,
            icon: 'none',
          })
          setTimeout(() =>{
            uni.navigateBack();
          },1500)
        })
      }else{
        uni.showToast({
          title: "请输入简介",
          icon: 'none',
        })
      }
    },

  },
}
</script>

<style lang='scss' scoped>

.intro{
	background: #fff;
	padding: 30upx;
	textarea{
		width: 100%;
	}
	.uni-textarea-placeholder{ color:#c0c0c0}
}
.btn{
  background: $primary;
  height:80upx;
  line-height: 80upx;
  width:690upx;
  margin: 0 auto;
  color:#ffffff;
  border-radius: 40upx;
  margin-top:50upx;
  text-align: center;
}
</style>
