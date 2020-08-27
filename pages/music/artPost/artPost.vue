<template>
	<view class="content">
		<form>
			<view class="uni-textarea pl-20">
				<textarea maxlength="200" @input="limitInput" placeholder-style="color:#999" placeholder="分享美好瞬间~" v-model="title" />
				<view class="counter">
					<text class="num">{{ inputTxtLength }}</text>
					/200
				</view>
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image, index) in imageList" :key="index">
									<view class="uni-uploader__file">
										<view class="iconfont icon-cha delbtn" @click="delImg(index)"></view>
										<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
									</view>
								</block>
								<cpimg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="9" :fixOrientation="true" :size="500" :maxWidth="1000" :ql="0.9" type="url" />
								<view class="uni-uploader__input-box" v-if="isShowBtnUpload"><view class="uni-uploader__input" @tap="chooseImage"></view></view>
							</view>
						</view>
						<view class="uni-uploader-head">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{ imageList.length }}/9</view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell location" v-show="false">
					<view class="uni-list-cell-navigate uni-navigate-right" @tap="chooseLocation">
						<view class="list-cell-l">
							<text class="iconfont icon-dizhi"></text>
							所在位置
						</view>
						<block v-if="hasLocation === false"><view class="list-cell-r">不显示当前位置</view></block>
						<block v-if="hasLocation === true">
							<view class="list-cell-r uni-ellipsis c_theme">
								<text class="iconfont icon-cha" @click.stop="clearlocation"></text>
								{{ locationAddress }}
							</view>
						</block>
					</view>
				</view>
				<view class="uni-list-cell limit" v-show="false">
					<view class="uni-list-cell-navigate">
						<view class="list-cell-l">
							<text :class="['iconfont', role == 0 ? 'icon-gongkai' : '', role == 1 ? 'icon-haoyou' : '', role == 2 ? 'icon-suo' : '']"></text>
							谁可以看
						</view>
						<view class="list-cell-r">
							<text v-for="(item, index) in roletxt" :key="index" :class="['txt', role == index ? 'active' : '']" @click="selectRole(index)">{{ item }}</text>
						</view>
					</view>
				</view>
				<view class="uni-list-cell" v-if="MusicId">
					<view class="uni-list-cell-navigate">
						<view class="list-cell-l">
						</view>
						<view class="list-cell-r uni-ellipsis c_theme">
							#{{ keystr }}#
							<text class="iconfont icon-cha c_999" style="margin-left: 10upx;" @click="clearmusic"></text>
						</view>
					</view>
				</view>
			</view>
		</form>
		<!--底部-->
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #f8f8f8;"><view class="btn" @click="Submit">发布</view></view>
		<!-- #ifdef APP-PLUS -->
		<view class="advbox" v-if=showmsk>
			<view class="imgbox">
				<view class="textbox">
					<view class="title">壹舞APP平台服务协议（EULA）</view>
					<view class="main">
						<p>用户在接受小舔狗APP平台服务之前，请务必仔细阅读本条款并同意本声明。</p>
						<p>第一条</p>
						　　<p>用户以各种方式使用壹舞平台服务和数据(包括但不限于发表、宣传介绍、转载、浏览及利用拓拼拼平台或拓拼拼平台用户发布内容)的过程中，不得以任何方式利用拓拼拼平台直接或间接从事违反中国法律、以及社会公德的行为，且用户应当恪守下述承诺：</p>
						
						　　<p>1. 发布、转载或提供的内容符合中国法律、社会公德;</p>
						
				    	   <p>2.不允许发布有令人反感的内容或滥用的用户。</p>
						
						　　<p>3. 不得干扰、损害和侵犯壹舞APP的各种合法权利与利益;</p>
						
						　　<p>4. 遵守拓拼拼平台以及与之相关的网络服务的协议、指导原则、管理细则等;</p>
						
						　　<p>5.壹舞APP有权对违反上述承诺的内容予以删除。</p>
						
						<p>第二条</p>
						
						　　<p>1. 用户在壹舞APP发表的内容(包含但不限于壹舞APP目前各产品功能里的内容)仅表明其个人的立场和观点，并不代表壹舞APP的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。壹舞APP不承担任何法律及连带责任。</p>
						
						　　<p>2. 用户在壹舞APP发布侵犯他人知识产权或其他合法权益的内容，壹舞APP有权予以删除，并保留移交司法机关处理的权利。</p>
						
						　　<p>3. 个人或单位如认为壹舞APP上存在侵犯自身合法权益的内容，应准备好具有法律效应的证明材料，及时与壹舞APP取得联系，以便壹舞APP迅速做出处理。</p>
						
						　　附则：对免责声明的解释、修改及更新权均属于壹舞APP所有。
					</view>
					<view class="maskbtnbox">
						<view class="" @click="toback()">暂不使用</view>
						<view class="colorblue" @click="showmsk=false">同意</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { host, post, get, formatLocation, formatTime, toLogin, getCurrentPageUrlWithArgs } from '@/common/util.js';
import cpimg from '@/components/cpimg.vue';
import { pathToBase64, base64ToPath } from '@/common/image-tools.js';
var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
export default {
	components: {
		cpimg
	},
	data() {
		return {
			showmsk:true,
			userId: '',
			token: '',
			hasLocation: false,
			isShowBtnUpload: true,
			location: {},
			locationAddress: '',
			imageList: [],
			base64Arr: [],
			sourceTypeIndex: 2,
			sourceType: ['拍照', '相册', '拍照或相册'],
			sizeTypeIndex: 2,
			sizeType: ['压缩', '原图', '压缩或原图'],
			countIndex: 8,
			count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			inputTxtLength: 0, //当前输入字数
			role: 0, //观看权限
			roletxt: ['公开', '好友', '私密'],
			title: '',
			ContentAbstract: '',
			ContentDetails: '',
			MusicId:'',//关联舞曲id
			keystr:'',//关联舞曲名称
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.MusicId=e.MusicId;
		this.keystr=e.keystr;
	},
	onShow() {},
	onUnload() {
		(this.imageList = []), (this.base64Arr = []), (this.title = ''), (this.isShowBtnUpload = true), this.clearlocation();
	},
	methods: {
		toback(){
			uni.navigateBack()
		},
		// 添加图片
		chooseImage: async function() {
			//#ifndef MP-WEIXIN
			let that = this;
			that.$refs.cpimg._changImg();
			//#endif
			//#ifdef MP-WEIXIN
			if (this.imageList.length >= 9) {
				let isContinue = await this.isFullImg();
				if (!isContinue) {
					return;
				}
			}
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				sizeType: sizeType[this.sizeTypeIndex],
				count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
					if (this.imageList.length >= 9) {
						this.isShowBtnUpload = false;
						this.imageList.splice(9);
					}
				}
			});
			//#endif
		},
		async base64Img(arr) {
			let base64Arr = [];
			for (let i = 0; i < arr.length; i += 1) {
				const res = await pathToBase64(arr[i]);
				base64Arr.push({
					PicUrl: res
				});
			}
			return base64Arr;
		},
		cpimgOk(file) {
			let that = this;
			that.base64Arr = that.base64Arr.concat(file);
			if (that.base64Arr.length >= 9) {
				that.isShowBtnUpload = false;
				that.base64Arr.splice(9);
			}
			that.imageList = that.base64Arr;
			console.log(that.imageList);
		},
		cpimgErr(e) {
			console.log(e);
		},
		isFullImg: function() {
			return new Promise(res => {
				//#ifndef APP-PLUS
				uni.showModal({
					content: '已经有9张图片了,是否清空现有图片？',
					success: e => {
						if (e.confirm) {
							this.imageList = [];
							res(true);
						} else {
							res(false);
						}
					},
					fail: () => {
						res(false);
					}
				});
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					content: "已经有9张图片了,是否清空现有图片？",
				}).then(_res=>{
					this.imageList = [];
					res(true);
					//确认
				  }).catch(_res=>{
					  res(false);
					//取消
				  })
				//#endif
			});
		},
		previewImage: function(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList
			});
		},
		chooseLocation: function() {
			var _this = this;
			// uni.openSetting();
			uni.getSetting({
				success(res) {
					console.log(res);
					if (!res.authSetting['scope.userLocation']) {
						//3.1 每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
						_this.getAuthorizeInfo();
					} else {
						_this.getLocationInfo();
					}
				}
			});
		},
		getLocationInfo() {
			uni.chooseLocation({
				success: res => {
					(this.hasLocation = true), (this.location = formatLocation(res.longitude, res.latitude)), (this.locationAddress = res.address);
				}
			});
		},
		getAuthorizeInfo() {
			//1. uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
			var _this = this;
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					//1.1 允许授权
					_this.getLocationInfo();
				},
				fail() {
					//1.2 拒绝授权
					console.log('你拒绝了授权，无法获得周边信息');

					//uni.openSetting();
				}
			});
		},
		//删除图片
		delImg(index) {
			this.imageList.splice(index, 1);
			if (this.imageList.length < 9) {
				this.isShowBtnUpload = true;
			}
		},
		//清空当前地址
		clearlocation: function() {
			this.hasLocation = false;
		},
		clearmusic(){
			this.MusicId="";
		},
		//设置观看权限
		selectRole(index) {
			this.role = index;
		},
		limitInput() {
			this.inputTxtLength = this.title.length;
		},
		//发布
		async UserPublishFind(base64img) {
			let result = await post('Find/UserPublishFind', {
				UserId: this.userId,
				Token: this.token,
				ShowRole: this.role,
				Title: this.title,
				Location: this.locationAddress,
				ContentAbstract: this.ContentAbstract,
				ContentDetails: this.ContentDetails,
				PicList: base64img,
				MusicId:this.MusicId
			});
			if (result.code === 0) {
				let _this = this;
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
				setTimeout(function() {
					_this.clearData();
					uni.navigateBack();
				}, 2000);
			} else if (result.code === 2) {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//发布验证
		verifysubmint() {
			if (this.title == '') {
				uni.showToast({
					title: '内容不能为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		async Submit() {
			let _this = this;
			let base64Arr = [];
			for (let i = 0; i < _this.imageList.length; i++) {
				base64Arr.push({
					PicUrl: _this.imageList[i]
				});
			}
			if (_this.verifysubmint()) {
				//#ifdef MP-WEIXIN
				base64Arr = await this.base64Img(this.imageList);
				//#endif
				_this.UserPublishFind(JSON.stringify(base64Arr));
			}
		},
		//清除数据
		clearData() {
			(this.imageList = []), (this.base64Arr = []), (this.title = ''), (this.isShowBtnUpload = true), (this.inputTxtLength = 0), this.clearlocation();
		}
	}
};
</script>

<style scoped lang="scss">
@import './style';
uni-page-head {
	border-bottom: 1px solid #eee;
}
</style>
