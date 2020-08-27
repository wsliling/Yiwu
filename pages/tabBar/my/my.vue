<template>
	<view>
		<view :class="['head',showHead?'tra':'']" :style="{'padding-top':barHeight+'px'}">
			<view class="flex-between" style="height: 44px;">
				<view class="head_l" style="width: 44px; height: 44px;"></view>
				<view class="title" style="font-size: 16px; font-weight: bold;">我的</view>
				<view class="head_r flex-column menuIco pd15" v-if="pageCon==1" @click="showMENU">
					<view class="line1"></view>
					<view class="line2"></view>
					<view class="line3"></view>
				</view>
			</view>
		</view>
		<view :style="{'height':(44+barHeight)+'px'}"></view>
		<block v-if="pageCon==1">
		<view class="pd15">
			<view class="header">
				<view class="user">
					<view class="user-left">
						<view class="user-img" @click="tolink('/pages/homepage/homepage?id='+memberInfo.Id)">
							<view>
								<image :src="memberInfo.Avatar||'/static/default.png'" mode="aspectFill"></image>
							</view>
						</view>
						<view class="user-name">
							<view class="name" v-if="memberInfo.NickName">
								<view class="uni-ellipsis">{{memberInfo.NickName}}</view>
								<image class="vip" src="http://m.dance-one.com/static/V.png" v-if="memberInfo.IsPlus" 
									@click.stop="navigate('member/openVip/openVip',{
										avatar:memberInfo.Avatar,
										name:memberInfo.NickName,
										endTime:memberInfo.PlusEndTime,
										isVIP:memberInfo.IsPlus
									},true)">
								</image>
							</view>
							<view class="name" v-else style="margin-top: 28upx;">您未登录，请先登录</view>
							<block v-if="isLogin">
								<view class="btns clear uni-mt10">
									<view class="btn" @click="tolink('/pages/member/editinfo/editinfo')"><image class="img30" src="http://m.dance-one.com/static/my/editor.png"></image>编辑资料</view>
									<view class="btn" @click="tolink('/pages/member/addUser/addUser')"><image class="img30" src="http://m.dance-one.com/static/my/add_min.png"></image>关注</view>
								</view>
								<view class="text uni-mt10"><label v-if="!memberInfo.Introduction">简介：</label>{{memberInfo.Introduction||'您还未编辑简介，快去编辑吧！'}}</view>
								<view class="icos flex-center-start uni-mt10">
									<text class="ico" v-if="memberInfo.Age"><text class="iconfont icon-zh1" style="font-size: 24upx; margin-right: 4upx;"></text>{{memberInfo.Age}}</text>
									<text class="ico" v-if="memberInfo.Area">{{memberInfo.Area}}</text>
									<text class="ico" v-if="memberInfo.UserDefined" @click="tolink('/pages/member/editinfo/editinfo')">{{memberInfo.UserDefined}}</text>
								</view>
							</block>
						</view>
					</view>
					<view class="user-right">
						<image src="http://m.dance-one.com/static/my/sign.png" mode="" v-if="memberInfo.IsShowV" @click.stop="navigate('member/openVip/openVip',{
								avatar:memberInfo.Avatar,
								name:memberInfo.NickName,
								endTime:memberInfo.PlusEndTime
							},true)">
						</image>
					</view>
				</view>
			</view>
		<view class="info uni-mb10">
			<view class="item" @click="tolink('/pages/member/myAssets/myAssets')">
				<view>
					{{wallet[0]||0}}. <span>{{wallet[1]||0}}</span>
				</view>
				<span class="text">
					钱包(元)
				</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=0')">
				<view>{{memberInfo.FansNum||0}}</view>
				<span class="text">粉丝</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=1')">
				<view>{{memberInfo.LikeNum||0}}</view>
				<span class="text">被赞</span>
			</view>
			<view class="item" @click="tolink('/pages/member/interactionData/interactionData?type=2')">
				<view>{{memberInfo.FollowNum||0}}</view>
				<span class="text">关注</span>
			</view>
		</view>
		</view>
		<view class="bg_fff tabList flex p_re">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</view>
		
		<!-- 我的作品 -->
		<view class="play-box item-box"  v-if="tabIndex==0&&hasData">
			<view class="item" v-for="(item,index) in datalist" :key="index" @click="tovideo(item.Type,item.Id)">
				<image :src="item.PicImg" mode="aspectFill"></image>
				<view class="playbtn"></view>
				<view class="tag" v-if="item.Type==1">课程</view>
			</view>
		</view>
		<view class="music-box item-box"  v-if="tabIndex==1&&hasData">
			<view class="item audiobox" v-for="(item,index) in datalist" :key="index" @click="toplaylist(item.Id,index)">
				<view :class="['islive',playID==item.Id&&isplayingmusic?'active':'']" @click.stop="playBtn(item)">
					<image :src="(playID==item.Id&&isplayingmusic)?'http://m.dance-one.com/static/play3.png':'http://m.dance-one.com/static/play2.png'" mode="widthFix"></image>
				</view>
				<image :src="item.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
			</view>
		</view>
		<view class="play-box item-box"  v-if="tabIndex==2&&hasData">
			<view class="item" v-for="(item,index) in datalist" :key="index" @click="tovideo(item.Type,item.AssociationId)">
				<image :src="item.PicImg" mode="aspectFill"></image>
				<view class="playbtn"></view>
				<view class="tag" v-if="item.Type==6">课程</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<!-- 抽屉导航 -->
		<view :class="['rightbox',showDrawer?'visible':'']">
			<view class="drawer_mask" @click="closeMENU"></view>
			<view class="drawer_content" :style="{'padding-top':barHeight+'px'}">
				<view class="drawer_hd flex-between" @click="closeMENU">管理工具<text class="iconfont icon-close"></text></view>
				<view class="sevice">
					<view class="item" @click="tolink('/pages/member/cart/cart')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon5.png" mode="aspectFit"></image>
							<view>购物车</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="openAttestation">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon6.png" mode="aspectFit"></image>
							<view>认证中心</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<!-- <uni-popup type="bottom" ref="ac">
						<div class="ac">
							<div class="list1" @click="$refs.ac.close()">
								<div class="item1" @click="tolink('member/regDancer/regDancer')">舞者认证</div>
								<div class="item1" @click="tolink('member/regMechanism/regMechanism')">机构认证</div>
								<div class="item1" @click="tolink('member/regShop/regShop')">店铺认证</div>
							</div>
							<div class="cancel" @click="$refs.ac.close()">取消</div>
						</div>
					</uni-popup> -->
					<view class="item" @click="tolink('/pages/member/myWorks/myWorks')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon7.png" mode="aspectFit"></image>
							<view>我的作品</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/myMusic/myMusic')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon8.png" mode="aspectFit"></image>
							<view>我的舞曲</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/myfind/myfind')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/myfind.png" mode="aspectFit"></image>
							<view>我的动态</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/collect/collect')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon9.png" mode="aspectFit"></image>
							<view>我的收藏</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/ordertype/ordertype')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon10.png" mode="aspectFit"></image>
							<view>订单列表</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/message/messageClass/messageClass')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon15.png" mode="aspectFit"></image>
							<view>我的消息</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"><span v-if="newscount>0" class="rag">{{newscount}}</span></view>
					</view>
					<view class="item" @click="tolink('/pages/member/team/team')">
						<view class="item-left">
							<image  src="/static/icons/team.png" mode="aspectFit"></image>
							<view>我的团队</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/share/share')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon16.png" mode="aspectFit"></image>
							<view>分享</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<!-- 我的下载先不做，苹果的下载和多端下载很难实现 -->
					<view class="item" @click="tolink('/pages/member/myDownload/myDownload')" v-if="false">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon18.png" mode="aspectFit"></image>
							<view>我的下载</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/interflow/interflow')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon11.png" mode="aspectFit"></image>
							<view>加入官方交流</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/kefu/kefu')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon12.png" mode="aspectFit"></image>
							<view>客服服务</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/aboutUs/aboutUs')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon13.png" mode="aspectFit"></image>
							<view>关于我们</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
					<view class="item" @click="tolink('/pages/member/set/set')">
						<view class="item-left">
							<image  src="http://m.dance-one.com/static/my/icon14.png" mode="aspectFit"></image>
							<view>设置</view>
						</view>
						<view class="arrowr uni-icon uni-icon-arrowright"></view>
					</view>
				</view>
			</view>
		</view>
		<playerMin></playerMin>
		</block>
		<view class="pd15" v-if="pageCon==2">
			<view class="header">
				<view class="user">
					<view class="user-left">
						<view class="user-img" @click="tolink('/pages/member/editinfo/editinfo')">
							<view>
								<image :src="memberInfo.Avatar||'/static/default.png'" mode="aspectFill"></image>
							</view>
						</view>
						<view class="user-name">
							<view class="name" v-if="memberInfo.NickName">
								<view class="uni-ellipsis">{{memberInfo.NickName}}</view>
							</view>
							<view class="name" v-else style="margin-top: 28upx;">您未登录，请先登录</view>
							<block v-if="isLogin">
								<view class="text uni-mt10"><label v-if="!memberInfo.Introduction">简介：</label>{{memberInfo.Introduction||'您还未编辑简介，快去编辑吧！'}}</view>
								<view class="icos flex-center-start uni-mt10">
									<text class="ico" v-if="memberInfo.Age"><text class="iconfont icon-zh1" style="font-size: 24upx; margin-right: 4upx;"></text>{{memberInfo.Age}}</text>
									<text class="ico" v-if="memberInfo.Area">{{memberInfo.Area}}</text>
									<text class="ico" v-if="memberInfo.UserDefined" @click="tolink('/pages/member/editinfo/editinfo')">{{memberInfo.UserDefined}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="sevice">
				<view class="item" @click="tolink('/pages/message/messageClass/messageClass')">
					<view class="item-left">
						<image  src="http://m.dance-one.com/static/my/icon15.png" mode="aspectFit"></image>
						<view>我的消息</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"><span v-if="newscount>0" class="rag">{{newscount}}</span></view>
				</view>
				<view class="item" @click="tolink('/pages/member/interflow/interflow')">
					<view class="item-left">
						<image  src="http://m.dance-one.com/static/my/icon11.png" mode="aspectFit"></image>
						<view>加入官方交流</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="item" @click="tolink('/pages/member/kefu/kefu')">
					<view class="item-left">
						<image  src="http://m.dance-one.com/static/my/icon12.png" mode="aspectFit"></image>
						<view>客服服务</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="item" @click="tolink('/pages/member/aboutUs/aboutUs')">
					<view class="item-left">
						<image  src="http://m.dance-one.com/static/my/icon13.png" mode="aspectFit"></image>
						<view>关于我们</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="item" @click="tolink('/pages/member/set/set')">
					<view class="item-left">
						<image  src="http://m.dance-one.com/static/my/icon14.png" mode="aspectFit"></image>
						<view>设置</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				pageCon:0,
				userId: "",
				token: "",
				barHeight:0,
				navigate,
				memberInfo:{},//用户信息
				wallet:[],
				newscount:0,
				myIncome:{},
				showHead:false,
				isLogin:false,
				showDrawer:false,
				tabList:[{id:0,name:'作品'},{id:1,name:'舞曲'},{id:2,name:'收藏'}],
				tabIndex:0,
				page:1,
				pageSize:12,
				datalist:[],
				loadingType: 0, //0加载前，1加载中，2没有更多了
				hasData: false,
				noDataIsShow:false,
				isLoad: false,
				playID:"",//当前播放
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			//this.pageCon=2;
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			//#endif
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.playID=uni.getStorageSync("playID");
			this.playIDtype=this.$store.state.isplayingmusic;
			this.showDrawer=false;
			this.getMemberInfo();
			//this.getMyIncome();
		},
		computed: {
			...mapGetters(['isplayingmusic']),
		   tabStyle(){
		     return ((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-80)/2)
		   }
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			//打开抽屉
			showMENU(){
				this.showDrawer = true
			},
			//关闭抽屉
			closeMENU(){
				this.showDrawer=false
			},
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				})
				if (result.code === 0) {
					this.isLogin=true;
					this.memberInfo = result.data;
					uni.setStorageSync("MemberId",result.data.Id)
					this.wallet=result.data.Wallet.split('.');
					this.$store.commit("update", {
					  Wallet:result.data.Wallet
					}); 
					 this.NewsCount();
					 this.cliTab(0);
				} else if (result.code === 2) {
					this.isLogin=false;
					uni.getStorageSync("userId","")
					uni.getStorageSync("token","")
					this.memberInfo={};
					this.datalist={};
					this.tabIndex=0;
					this.newscount=0;
					let _this = this;
					uni.showModal({
						title:"登录提示",
						content: "您还没有登录，是否重新登录？",
						confirmColor:"#DD196D",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			//跳转
			tolink(Url) {
				if(toLogin()){
					uni.navigateTo({
						url: Url
					})
					if(this.showDrawer){
						this.showDrawer=false;
					}
				}
			},
			tovideo(type,id){
				if(this.tabIndex==1){
					if(type==1){
						uni.navigateTo({
							url: '/pages/video/videoDetails/videoDetails?id='+id
						})
					}else{
						uni.navigateTo({
							url: '/pages/replylist/replylist?id='+id
						})
					}
				}else{
					if(type==6){
						uni.navigateTo({
							url: '/pages/video/videoDetails/videoDetails?id='+id
						})
					}else{
						uni.navigateTo({
							url: '/pages/replylist/replylist?id='+id
						})
					}
				}
			},
			openAttestation(){
				// this.$refs.ac.open();
				// return;
				let urlstr="";
				if(toLogin()){
					uni.showActionSheet({
						itemList: ['舞者认证', '机构认证', '店铺认证'],
						success: (e) => {
							console.log(e.tapIndex);
							if(e.tapIndex==0){
								urlstr="/pages/member/regDancer/regDancer";
							}else if(e.tapIndex==1){
								urlstr="/pages/member/regMechanism/regMechanism";
							}else if(e.tapIndex==2){
								urlstr="/pages/member/regShop/regShop";
							}
							uni.navigateTo({
								url: urlstr
							})
						}
					})
				}
			},
			async NewsCount() {
				let result = await post("News/NewsCount", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				});
				if (result.code === 0) {
					this.newscount = result.count;
				} 
			},
			// 获取直播币
			async getMyIncome() {
				let result = await post("User/GetMyIncome", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				});
				if (result.code === 0) {
					this.myIncome = result.data;
				} 
			},
			cliTab(index){
				if(toLogin()){
					this.tabIndex = index
					this.page=1;
					this.datalist=[];
					this.noDataIsShow = false;
					this.hasData = false;
					this.GetUserData();
				}
			},
			//获取用户关联数据
			async GetUserData(){
			 let url="",json={};
			 if(this.tabIndex==0){
				url= "User/GetMyWorksList";
				json={
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize,
					Type: 0
				}
			 }else if(this.tabIndex==1){
				url= "DanceMusic/DanceMusicList";
				json={
					UserId: this.userId,
					Token: this.token,
					MemberId:uni.getStorageSync("MemberId"),
					page: this.page,
					pageSize: this.pageSize
				}
			 }else if(this.tabIndex==2){
				url= "User/MemberCollections"; 
				json={
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize,
					Type: 7
				}
			 }
			 let result =await post(url,json);
			 if(result.code==0){
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.datalist = result.data;
				}
				if (this.page > 1) {
					this.datalist = this.datalist.concat(
						result.data
					);
				}
				if (result.data.length <this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				} 
				if(this.tabIndex==1){
					this.setAudiolist(this.datalist);
				}
			 }
			},
			toplaylist(id,index){
				uni.setStorageSync("musicList",this.datalist)
				uni.navigateTo({
					url:'/pages/music/playMusic/playMusic?nowIndex='+index+'&id='+id
				})	
			},
			//播放
			playBtn(item){
				let src=item.Audio,
				    id=item.Id,
					isbuy=item.IsShowBuy,
					PicImg=item.PicImg,
					title=item.Name;
				if(isbuy==0){
					this.playID=id;
					if(id==uni.getStorageSync("playID")){
						if (this.playIDtype) {
							this.$au_player.pause();
						} else {
							this.$au_player.play();
						}
						this.playIDtype=!this.playIDtype;
					}else{
						this.setPlaydetail({id,pic:PicImg});
						this.$au_player.title = title;
						this.playIDtype=true;
						this.$au_player.src = src;
						this.$au_player.play();
					}
					this.setIsplayactive(true)				
					this.setIsplayingmusic(this.playIDtype)
					Vue.prototype.cusPlay = this.onPlayFn
					Vue.prototype.cusTimeUpdate = this.onTimeUpdateFn
					Vue.prototype.cusEnded = this.onEndedFn
				}else{
					uni.showModal({
						content: "该舞曲需付费,去付费？",
						success(res) {
							if (res.confirm) {
								if(toLogin()){
									let buyInfo={
										PicImg:item.PicImg,
										name:item.Name,
										price:item.Price
									}
									uni.setStorageSync('buyInfo', buyInfo);
									uni.navigateTo({
										url:'/pages/pay2/pay2?type=1&id='+id
									})
								}
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			onPlayFn(){
				this.setIsplayactive(true)
				uni.setStorageSync("playID",this.playID);
			},
			onEndedFn() {
				this.playIDtype = false;
				this.setIsplayingmusic(false)
				this.setIsplayactive(false)
			},
			onTimeUpdateFn() {
				const curtime = this.$au_player.currentTime
				return Math.floor(curtime)
			},
			
		},
		onPageScroll(e){
			if(e.scrollTop>50){
				this.showHead=true;
			}else{
				this.showHead=false;
			}
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.GetUserData();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
</style>
