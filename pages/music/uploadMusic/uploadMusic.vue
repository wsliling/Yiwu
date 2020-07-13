<template>
	<view>
		<view class="line-list">
			<view class="line-item">
				<view class="lab">曲名</view>
				<view class="item_r flex1"><input type="text" placeholder="请输入曲名" v-model="Title" class="flex1" /></view>
			</view>
			<view class="line-item">
				<view class="lab">价格</view>
				<view class="item_r flex1 flex-between">
					<input type="text" placeholder="请输入价格" v-model="Price" :disabled="hascheck" class="flex1" />
					<label class="flex-end" @click="hascheck = !hascheck">
						<radio class="radio" :color="hascheck ? '#de1b6e' : '#999'" checked="true"></radio>
						<text>免费</text>
					</label>
				</view>
			</view>
			<view class="line-item line-arrow-r" @click="isShowSelect = true">
				<view class="lab">类型选择</view>
				<view class="item_r flex1"><input type="text" placeholder="请选择" class="flex1" v-model="musictype" disabled="true"/></view>
			</view>
			<view class="line-item line-arrow-r" @click="isShowSource = true">
				<view class="lab">舞曲来源</view>
				<view class="item_r flex1"><input type="text" placeholder="请选择" class="flex1" v-model="sourcetype" disabled="true"/></view>
			</view>
			<view class="line-item" @click="chooseMusic">
				<view class="filebtn">{{ musicFile ? '已选择' : '请选择舞曲' }}</view>
				<!-- 				<view class="" v-if="musicFile">{{fileName}}</view>
				<view class="" v-else>未选择</view> -->
				<input type="text" value="" dir="rtl" v-model="fileName" v-if="musicFile" disabled="true" class="flex1" />
				<input type="text" value="未选择" disabled="true" v-else />
			</view>
			<view class="line-item" style="flex-wrap: wrap;">
				<view class="lab" style="width: 100%;">请选择封面</view>
				<view class="picbox flex-column uni-mt10" @click="uplLoadImg">
					<image class="img" v-if="picStr" :src="picStr" mode="aspectFill"></image>
					<text class="c_999" v-else>上传封面</text>
				</view>
			</view>
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #fff;" @click="uplLoadBtn"><view class="btn">确定</view></view>
		<!-- 选择曲单	 -->
		<uni-popup mode="fixed" :show="isShowSelect" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">选择类型</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item, index) in classifylist" :key="index" @click="SelectMenu(item.Id, item.Name)">
							<view class="line-item-l text_left">
								<text class="txt">{{ item.Name }}</text>
							</view>
						</view>
					</view>
					<view class="btns flex-between"><view class="btn c_theme" @click="hidePopup">关闭</view></view>
				</view>
			</view>
		</uni-popup>
		<!-- 选择来源 -->
		<uni-popup mode="fixed" :show="isShowSource" :h5Top="true" position="bottom" @hidePopup="hidePopup">
			<view class="uni-modal-music Menulist__modal">
				<view class="uni-modal__hd pd15">选择来源</view>
				<view class="uni-modal__bd">
					<view class="line-list">
						<view class="line-item" v-for="(item, index) in Sourcelist" :key="index" @click="SelectSource(item.Id, item.Name)">
							<view class="line-item-l text_left">
								<text class="txt" v-if="item.TypeInt == 1">{{ item.Name }}</text>
							</view>
						</view>
					</view>
					<view class="btns flex-between"><view class="btn c_theme" @click="hidePopup">关闭</view></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { post } from '@/common/util';
import { pathToBase64 } from '@/common/image-tools.js';
import uniPopup from '@/components/uni-popup.vue';
export default {
	data() {
		return {
			userId: '',
			token: '',
			Title: '',
			Price: '',
			picStr: '',
			picStrbase64: '',
			isShowSelect: false, //类型
			isShowSource: false, //来源
			musictype: '', //选中类型
			sourcetype: '', //选中来源
			hascheck: false, //是否选中免费
			musicFile: '', //音频文件
			fileName: '',
			classifylist: [], //类型列表
			Sourcelist: [], //来源列表
			ClassId: '' //类型Id
		};
	},
	components: { uniPopup },
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getclassifyList();
		this.getSource();
		
	},
	onShow() {
		this.fileName = uni.getStorageSync('fileName');
		this.musicFile = uni.getStorageSync('filePath');
		console.log(uni.getStorageSync("fileName"), this.musicFile, 'this.musicFile');
		uni.uploadFile({
			url: 'http://ywapi.wtvxin.com/api/DanceMusic/UploadAudio', //仅为示例，非真实的接口地址
			filePath: this.fileName,
			name: 'file',
			formData: {
				'UserId': uni.getStorageSync('userId'),
				'Token': uni.getStorageSync('token')
			},
			success: (uploadFileRes) => {
				console.log(uploadFileRes.data);
			}
		});
	},
	methods: {
		//取消（统一关闭弹窗）
		hidePopup() {
			this.isShowSelect = false;
			this.isShowSource = false;
		},
		// 类型选中
		SelectMenu(id, name) {
			this.musictype = name;
			this.ClassId = id;
			this.isShowSelect = false;
		},
		// 舞曲来源选中
		SelectSource(id, name) {
			this.sourcetype = name;
			this.isShowSource = false;
		},
		//获取类型
		getclassifyList() {
			post('DanceMusic/DanceMusicClassList', {}).then(res => {
				if (res.code === 0) {
					this.classifylist = res.data;
				}
			});
		},
		//获取来源
		getSource() {
			post('DanceMusic/GetSource', {
				Type: 1
			}).then(res => {
				if (res.code === 0) {
					this.Sourcelist = res.data;
				}
			});
		},
		chooseMusic() {
			uni.navigateTo({
				url: '/pages/uploadFile/uploadFile?type=0'
			});
		},
		//发布舞曲
		async uplLoadMusic() {
			if (this.hascheck) {
				var IsCharge = 0;
			} else {
				var IsCharge = 1;
			}
			let res = await post('DanceMusic/UploadDanceMusic', {
				UserId: this.userId,
				Token: this.token,
				ClassId: this.ClassId,
				Audio: this.musicFile,
				CoverPic: this.picStrbase64,
				Name: this.Title,
				IsCharge: IsCharge,
				Price: this.Price,
				Source: this.sourcetype
			});
			if (res.code == 0) {
				uni.showToast({
					title: '发布成功'
				});
				uni.setStorageSync('fileName', ''); //清空缓存
				uni.setStorageSync('filePath', '');
				setTimeout(function() {
					uni.navigateBack();
				}, 1500);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		},
		//上传
		uplLoadImg() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: res => {
					// tempFilePath可以作为img标签的src属性显示图片
					this.picStr = res.tempFilePaths[0];
					this.UploadPhoto();
				}
			});
		},
		async base64Img(arr) {
			const res = await pathToBase64(arr);
			return res;
		},
		async UploadPhoto() {
			this.picStrbase64 = await this.base64Img(this.picStr);
			console.log(this.picStr);
		},
		uplLoadBtn() {
			if (this.yanzheng()) {
				this.uplLoadMusic();
			}
		},
		yanzheng() {
			if (this.Title == '') {
				uni.showToast({ title: '请输入舞曲名称！', icon: 'none' });
				return false;
			}
			if (!this.hascheck && (this.Price == 0 || this.Price == '')) {
				uni.showToast({ title: '请输入价格！', icon: 'none' });
				return false;
			}
			if (this.ClassId == '') {
				uni.showToast({ title: '请选择舞曲类型！', icon: 'none' });
				return false;
			}
			if (this.sourcetype == '') {
				uni.showToast({ title: '请选择舞曲来源类型！', icon: 'none' });
				return false;
			}
			if (this.picStr == '') {
				uni.showToast({ title: '请选择舞曲封面！', icon: 'none' });
				return false;
			}
			if (this.musicFile == '') {
				uni.showToast({ title: '请选择要上传的舞曲！', icon: 'none' });
				return false;
			}
			return true;
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #fff;
}
.lab {
	width: 160upx;
}
.picbox {
	width: 240upx;
	height: 240upx;
	background: #f2f2f2;
	border-radius: 12upx;
	overflow: hidden;
}
.tips {
	font-size: 24upx;
	color: #666;
	text {
		font-size: 40upx;
		font-weight: bold;
		line-height: 1;
		margin-right: 10upx;
	}
}
.line-item textarea {
	width: 100%;
}
.filebtn {
	background-color: #de1b6e;
	color: #fff;
	padding: 4upx 18upx;
	border-radius: 4upx;
}
.radio {
	transform: scale(0.76);
}
</style>
