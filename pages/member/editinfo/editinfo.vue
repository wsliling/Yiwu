<template>
  <view class="editpage">
	  <view class="line-list">
	  	<view class="line-item line-arrow-r">
	  		<view class="lab">头像</view>
			<view class="item_r avatar" @click="uplLoadImg">
			    <image class="img" :src="Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
			</view>
	  	</view>
		<view class="line-item line-arrow-r" @click="tolink('/pages/member/editNickName/editNickName?text='+info.NickName)">
			<view class="lab">昵称</view>
			<view class="item_r">
			  <input type="text" placeholder="去设置" disabled class="flex1 text_right" :value="info.NickName">
			</view>
		</view>
		<view class="line-item line-arrow-r" @click="tolink('/pages/member/editintro/editintro?text='+info.Introduction)">
			<view class="lab">简介</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <input type="text" placeholder="去设置" disabled class="flex1 text_right" :value="info.Introduction">
			</view>
		</view>
		<view class="line-item line-arrow-r">
			<view class="lab">生日</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <!-- <input type="text" placeholder="去设置" disabled class="flex1 text_right" :value="info.Birthday"> -->
			  <picker mode="date" :value="info.Birthday" :start="startDate" :end="endDate" @change="bindDateChange">
			  	{{info.Birthday}}
			  </picker>
			</view>
		</view>
		<view class="line-item line-arrow-r" @click="showMulLinkageTwoPicker">
			<view class="lab">地区</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <input type="text" placeholder="去设置" disabled class="flex1 text_right" v-model="pickerText">
			</view>
		</view>
		<view class="line-item line-arrow-r">
			<view class="lab">自定义</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <input type="text" placeholder="去添加" class="flex1 text_right"  v-model="info.UserDefined">
			</view>
		</view>
		<view :class="['line-item',info.IsBind?'line-arrow-r':'']" @click="BindRelation(info.IsBind)">
			<view class="lab">邀请人</view>
			<view class="item_r flex1" style="margin-left: 20upx;">
			  <input type="text" placeholder="未绑定" disabled class="flex1 text_right" v-model="info.Inviter">
			</view>
		</view>
	  </view>
	  <view class="btnbox" @click="submint">确定</view>
	  <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
	   @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	<!-- 弹出输入邀请人 -->
	<uni-popup :show="showPopupBind" v-on:hidePopup="hidePopup">
	  <div class="modal-head">填写邀请人</div>
	  <div class="modal-content">
		  <input type='text' placeholder="请输入您的邀请人" v-model="inviteCode" auto-focus/>
	  </div>
	  <view class="modal-footer flex-between">
		<view class="btn-cancel" @click="hidePopup">取消</view>
		<view class="btn-confirm" @click="onConfirmBind">确定</view> 
	  </view>
	</uni-popup>
  </view>
</template>

<script>
import {post,valPhone} from '@/common/util'
import { pathToBase64, base64ToPath } from '@/common/image-tools.js';
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
import cityData from '@/common/city.data.js';
import uniPopup from '@/components/uni-popup.vue';
export default {
  data () {
    return {
      userId:"",
      token:"",
      info:{},
      Avatar:"",
	  mysign:"",//个性签名
	  pickerText:"",
	  popuptype:"",
	  mulLinkageTwoPicker: cityData,
	  themeColor: '#007aff',
	  mode: '',
	  deepLength: 1,
	  pickerValueDefault: [0],
	  pickerValueArray:[],
	  showPopupBind:false,
	  inviteCode:""
    }
  },
  components: {
    mpvuePicker,
	uniPopup
  },
  onShow(){
	  this.userId = uni.getStorageSync("userId")
	  this.token = uni.getStorageSync("token")
    this.GetMemInfo()
  },
  computed: {
  	startDate() {
  		return this.getDate('start');
  	},
  	endDate() {
  		return this.getDate('end');
  	}
  },
  methods: {
    tolink(url){
      uni.navigateTo({
        url
      })
    },
    GetMemInfo(){
      post('User/GetMemInfo',{
        UserId:this.userId,
        Token:this.token
      }).then(res=>{
        this.info = res.data;
        this.Avatar=this.info.Avatar;
		this.pickerText=this.info.Province+" "+this.info.City;
      })
    },
	async submint(){
		let result = await post("User/EditUserInfo", {
			"UserId": this.userId,
			"Token": this.token,
			"Birthday": this.info.Birthday,
			"City":this.info.City,
			"Province":this.info.Province,
			"UserDefined":this.info.UserDefined
		});
		if (result.code === 0) {
			let _this=this;
			uni.showToast({
				title: result.msg,
				icon: "none",
				duration: 1500
			});
			setTimeout(function() {
				uni.navigateBack()
			},1800)
		}else {
			uni.showToast({
				title: result.msg,
				icon: "none",
				duration: 2000
			});
		}
	},
    //上传头像
    uplLoadImg(){
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) =>{
				// tempFilePath可以作为img标签的src属性显示图片
				this.Avatar=res.tempFilePaths[0];console.log(this.Avatar)
				this.UploadPhoto()
			} 
		})
    },
	async base64Img(arr) {
		const res = await pathToBase64(arr);
		return res;
	},
    async UploadPhoto(){
		let Avatarstr=await this.base64Img(this.Avatar);console.log(Avatarstr)
		post('User/UploadPhoto',{
			UserId:this.userId,
			Token:this.token,
			Avatar:Avatarstr
		}).then(res=>{
			this.Avatar=res.data;
			uni.showToast({
			  title: res.msg,
			})
		})
    },
	// 二级联动选择
	showMulLinkageTwoPicker() {
		this.pickerValueArray = this.mulLinkageTwoPicker
		this.mode = 'multiLinkageSelector'
		this.deepLength = 2
		this.pickerValueDefault = [0, 0]
		this.$refs.mpvuePicker.show()
		console.log(this.pickerValueArray)
	},
	onConfirm(e) {
		let arr=e.label.split('-');
		this.info.City=arr[1];
		this.info.Province=arr[0];
		this.pickerText=e.label.replace("-"," ");
	},
	onCancel(e) {
		console.log(e)
	},
	bindDateChange: function(e) {
		this.info.Birthday = e.target.value
	},
	getDate(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	},
	//绑定推荐关系（无推荐关系可绑定）
	BindRelation(e){
	  if(e==1){
		this.inviteCode="";
		this.showPopupBind=true;
	  }
	},
	//统一的关闭popup方法
	hidePopup: function() {
	  this.showPopupBind = false;
	},
	//确认绑定推荐人
	onConfirmBind(){
	  if(valPhone(this.inviteCode)){
		this.BindRelationMobile()
	  }
	},
	BindRelationMobile(){
	  post('Login/BindRelationMobile',{
		UserId:this.userId,
		Token:this.token,
		mobile:this.inviteCode
	  }).then(res=>{
		wx.showToast({
		  title: res.msg,
		  icon: "none"
		})
		this.hidePopup();
		this.GetMemInfo();
	  })
	},
	
  },
}
</script>

<style lang='scss' scoped>
.avatar{
  height:100upx;width:100upx;
  .img{
    width:100%;height:100%;border-radius:50%;
  }
}
.item_r{
	flex:0 0 auto;
	input{
	width:515upx;
	}
}
.btnbox{
	width: 690upx;
	height: 88upx;
	line-height: 88upx;
	border-radius: 44upx;
	text-align: center;
	font-size: 32upx;
	color: #fff;
	background-color: #de1b6e;
	position: fixed;
	left: 30upx;
	bottom: 60upx;
}
.editpage /deep/ .uni-popup-middle{
  padding: 0 !important;
  width: 480upx;
  .modal-head{
    font-size: 32upx;
    padding: 20upx;
  }
  .modal-content{ 
    padding: 0 20upx 20upx;
    input{
      height: 80upx; width: 100%;
    }
  }
  .modal-footer{
    text-align: center;
    width: 100%;
    border-top: 1px solid #eee;
    view{ width: 50%; height: 80upx; line-height: 80upx; font-size: 30upx}
    view:hover{ background: #f5f5f5}
    .btn-cancel{ border-right: 1px solid #eee;}
    .btn-confirm{color: $primary}
  }
  .uni-close-bottom:after{
	  border: none;
  }
}
</style>
