<template>
	<view class="content">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="index_head flex-center" style="border-bottom: 1px solid #eee;">
				<view class="title"><image src="http://m.dance-one.com/static/headTitle.png" mode="widthFix"></image></view>
				<view class="seachbox" v-if="false">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" class="flex1"></ans-input>
				</view>
				<!-- #ifndef H5 -->
				<view class="head_r" @click="scanCode" v-if="false">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
				<!-- #endif -->
			</view>
			
		</view>
		<view :style="{'height':(40+barHeight)+'px'}"></view>
		<!-- 首页 -->
		<view class="index-item index-item-0" v-if="pageCon==1">
			<!-- 达人 -->
			<view class="Yi-mechanism bg_fff" v-if="TeacherUserList.length">
				<scroll-view class="Daren-swiper-tab" scroll-x>
					<view class="item" v-for="(item,index) in TeacherUserList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
						<view class="tx">
							<image :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
						</view>
						<view class="name uni-ellipsis">
							{{item.Name}}
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 图文 -->
			<block v-if="datalist.length">
				<block v-for="(item,index) in datalist" :key="index">
					<!-- 推荐用户 -->
					<view class="Yi-recomUser bg_fff uni-mb5" v-if="index==3&&recuserlist.length>0">
						<view class="Yi-hd flex-between">
							<view class="title">推荐用户</view>
							<view class="more" @click="tolink('/pages/member/addUser/addUser')">查看全部</view>
						</view>
						<view class="Yi-bd">
							<scroll-view class="User-swiper-tab" scroll-x>
								<view class="item" v-for="(e,i) in recuserlist" :key="i">
									<view class="uni-icon uni-icon-closeempty close" @click="closeuser(i)"></view>
									<view class="tx" @click="tolink('/pages/homepage/homepage?id='+e.Id)">
										<image :src="e.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
										<!-- #ifndef MP-WEIXIN -->
										<view class="islive" v-if="item.Flag==1" @click.stop="navigate('liveplay/live',{id:item.MemberId})">
											<view class="line line1"></view>
											<view class="line line2"></view>
											<view class="line line3"></view>
											<view class="txt">直播</view>
										</view>
										<!-- #endif -->
									</view>
									<view class="name uni-ellipsis">
										{{e.NickName||'壹舞用户'}}
									</view>
									<view :class="['flow',e.IsFollow==1?'active':'']" @click="flow(e.Id,i,4)">
										{{e.IsFollow==1?'已关注':'关注'}}
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="Yi-media bg_fff uni-mb5" @click="toRec(item.Type,item.Id)">
						<view class="media-hd flex-between">
							<view class="author flex-start" @click.stop="tolink('/pages/homepage/homepage?id='+item.MemberId)">
								<view class="tx">
									<image :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
									<!-- #ifndef MP-WEIXIN -->
									<view class="islive" v-if="item.Flag==1" @click.stop="navigate('liveplay/live',{id:item.MemberId})">
										<view class="line line1"></view>
										<view class="line line2"></view>
										<view class="line line3"></view>
										<view class="txt">直播</view>
									</view>
									<!-- #endif -->
								</view>
								<view class="name uni-ellipsis">{{item.NickName}}</view>
								<view class="tochat" @click.stop="tolink('/pages/chat/chat?id='+item.MemberId,'login')"><image src="http://m.dance-one.com/static/chat.png"></image></view>
							</view>
							<view v-if="item.IsMy==0" @click.stop="flow(item.MemberId,index,1)" :class="['flow','active',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
						</view>
						<view class="media-bd">
							<view class="desc uni-ellipsis2">
								{{item.Title}}
							</view>
							<view :class="['maxpic mv',item.fixed?'dis':'']" v-if="item.Type==1" :id="'box'+item.Id">
								<view v-if="!item.play||item.fixed" class="isplay" @click.stop="playBtn(index,item.Id)"></view>
								<video v-if="item.play&&!onHidePage" :src="item.VideoUrl" :controls="isControls" style="width: 100%;height: 100%;" :muted="ismuted" @play="playVideo(item.Id,index)" @pause="pauseVideo(item.Id,index)" @fullscreenchange="screenchange" :id="'video'+item.Id" :show-mute-btn="true" object-fit="contain" :show-center-play-btn="false" @ended="endedFn(item.Id,index)" @click.stop="">
									<cover-view class="cover-mark" @click.stop="ControlsFn" v-if="!isControls&&!isClick"></cover-view>
								</video>
								<image class="postpic" :src="item.PicImg" mode="widthFix"></image>
							</view>
							<view class="maxpic maxh" v-if="(item.Type==0||item.Type==2||item.Type==4)&&item.PicImg">
								<view v-if="item.Type==2" class="tag">课程</view>
								<image :src="item.PicImg" mode="widthFix"></image>
							</view>
							<view class="maxpic audio" v-if="item.Type==3">
								<image :src="item.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
								<view :class="['isaudio',playID==item.Id&&isplayingmusic?'active':'']" @click.stop="playAudio(item)">
									<view class="line line1"></view>
									<view class="line line2"></view>
									<view class="line line3"></view>
								</view>
							</view>
						</view>
						<view class="media-ft flex-between" v-if="item.Type!=3&&item.Type!=4">
							<view class="ft_l flex-start">
								<view @click.stop="likeBtn(item.Id,index,item.Type)" :class="['txt_info like',item.IsLike==1?'active':'']">{{item.LikeNum>0?item.LikeNum:'点赞'}}</view>
								<view class="txt_info reply" @click.stop="showReply(item.Id,item.NickName,item.Type,index)">{{item.CommentNum}}</view>
								<!-- #ifdef APP-PLUS -->
								<view @click.stop="popShare(xqUrl[item.Type].url+item.Id)">
									<view class="txt_info share"></view>
								</view>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS -->
								<share :url="xqUrl[item.Type].url+item.Id" :param="item.Type+'&'+item.Id">
									<view class="txt_info share"></view>
								</share>
								<!-- #endif -->
							</view>
							<view class="ft_r" v-if="item.Type!=0">
								<view @click.stop="CollectBtn(item.Id,index,item.Type)" :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
							</view>
						</view>
						<view class="likenum" v-if="item.LikeNum>0">被{{item.LikeNum}}人赞过</view>
						<view class="media-comment" v-if="item.CommentNum>0">
							<block v-for="(i,e) in item.EvaluateList" :key="e">
								<view class="comment-item" v-if="e<4">
									<text class="name">{{i.MemberName||'匿名用户'}}：</text>
									<text class="con">
										{{i.Comment}}
									</text>
								</view>
							</block>
							<view class="more c_999" v-if="item.CommentNum>4">
								查看全部评论
							</view>
						</view>
					</view>
				</block>
				<view class="uni-tab-bar-loading" v-if="datalist.length">
					<uni-load-more :loadingType="LoadingType0"></uni-load-more>
				</view>	
			</block>
			<noData v-if="noDataIsShow0"></noData>
		</view>
		<view class="staticPage uni-bg-white" v-if="pageCon==2">
			<view class="banner">
				<image src="http://m.dance-one.com/static/img/banner.jpg" mode="widthFix"></image>
			</view>
			<view class="itembox pd15">
				<view class="hd center">公司介绍</view>
				
				<view class="txtbox uni-mb10">
					<view class="p" style="text-indent: 60upx;">
						深圳市育诚博雅教育培训有限公司是2018年在广东省深圳市龙岗区注册成立的有限责任公司，注册地址位于深圳市龙岗区坂田街道长坑西六巷2号1-2号。
					</view>
					<view class="p" style="text-indent: 60upx;">
						深圳市育诚博雅教育培训有限公司的经营范围是：舞蹈培训、幼儿培训、学前培训、留学培训；文化交流策划、演出策划。
					</view>
					<view class="p" style="text-indent: 60upx;">
						公司所属舞蹈行业，面向各类群体，成人、幼儿等，培训舞蹈种类繁多，师资力量强大，汇聚业内精英、专家。教学设施完善、教学环境舒适，每年有大量毕业学员从育成博雅走出去。
					</view>
				</view>
				<view class="img uni-mb10"><image src="http://m.dance-one.com/static/img/item1.png" mode="widthFix"></image></view>
			</view>
			<view class="itembox pd15">
				<view class="hd center">关于壹舞</view>
				<view class="txtbox">
					<view class="p">
						Dance One(壹舞）是深圳市育诚博雅培训有限公司（shenzhen Yucheng Boya Education Training Co.,Ltd）旗下的线上品牌，我们意旨打造一个国际化，专业化，多元化的社交媒体线上舞蹈平台。
					</view>
				</view>
				<view class="icons flex-between uni-mb10">
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon1.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">国际化</text>
							<text class="en">internationalization</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon2.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">专业</text>
							<text class="en">specialized</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon3.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">多元化</text>
							<text class="en">diversification</text>
						</view>
					</view>
				</view>
				<view class="img uni-mb10">
					<image src="http://m.dance-one.com/static/img/item2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="itembox">
				<view class="hd center">合作机构</view>
				<view class="icons jigou flex flexWrap uni-mb10">
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon4.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon5.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon6.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon7.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon8.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon9.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon10.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon11.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon12.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon13.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="itembox youshi">
				<view class="hd center">我们的优势</view>
				<view class="icons flex-between">
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon14.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">名师荟萃</text>
							<text class="zh">很多优秀的达人和名师都聚集在我们平台</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon15.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">机构云集</text>
							<text class="zh">各种行业性舞蹈机构入驻在我们平台</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://m.dance-one.com/static/img/icon16.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh">课程繁多</text>
							<text class="zh">平台有繁多种类的舞蹈课程一级舞曲</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<!-- #ifndef MP-WEIXIN -->
		<!-- <view class="uploadbtn flex-column" @click="navigate('liveplay/live')">直播</view> -->
		<!-- #endif -->
		<playerMin></playerMin>
		<view class="topbtn" @click="Top" v-if="isTop"><text class="iconfont icon-iconset0418" style="font-size: 40upx;"></text></view>
		<!-- 弹出评论 -->
		<uni-popup ref="ReplyListWin" type="bottom" @change="changeClose">
			<view class="uni-modal-ReplyBox">
				<view class="close iconfont icon-close" @click="hidePopup"></view>
				<view class="uni-modal__hd">{{commenNum?commenNum+'条':''}}评论</view>
				<scroll-view scroll-y="true" class="uni-modal__bd text_left" v-if="hasReplyData">
					<block v-for="(item,index) in replylist" :key="index">
						<reply-item :itemData='item' @Sendreplay="Sendreplay"></reply-item>
					</block>
					<view class="uni-tab-bar-loading" style="text-align: center; color: #999;">
						<text v-if="loadingReplyType==0" @click="loadMoreReply">查看更多</text>
						<text v-if="loadingReplyType==1">加载中…</text>
						<text v-if="loadingReplyType==2">没有更多了</text>
					</view>
				</scroll-view>
				<view v-if="noDataReplyIsShow" style="padding: 60upx; color: #999;text-align: center;">还没有评论哦</view>
				<!-- 底部发表按钮 -->
				<!-- #ifdef H5 -->
				<view style="height: 110upx;"></view>
				<!-- #endif -->
				<view class="foot-fiexd">
					<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
					<view :class="['foot-reply flex-between',IsShowReplyBox?'active':'']">
						<input class="ipt text_left" type="text" cursor-spacing="10" v-model="Comment" @click="showReplyBox" :placeholder="placeholder"/>
						<view class="btn-r" v-if="IsShowReplyBox">
							<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发布</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="sharetWin" type="bottom" @change="changeClose">
			   <view class="uni-popup-share">
				   <view class="pop-hd">分享</view>
					<view class="sharelist flex-between">
						<view class="share-item" @click.stop="appShare('WXSceneSession')">
							<image class="imgico" src="http://m.dance-one.com/static/wx.png" mode="aspectFit"></image>
							<text class="txt">微信好友</text>
						</view>
						<view class="share-item" @click.stop="appShare('WXSenceTimeline')">
							<image class="imgico" src="http://m.dance-one.com/static/ico_quan.png" mode="aspectFit"></image>
							<text class="txt">微信朋友圈</text>
						</view>
						<view class="share-item" @click.stop="appShare()">
							<image class="imgico" src="http://m.dance-one.com/static/share_link.png" mode="aspectFit"></image>
							<text class="txt">复制链接</text>
						</view>
					</view>
					<view style="height: 100upx;"></view>
					<view class="uni-close-bottom" @click.stop="hidePopup">关闭</view>
			   </view>
		</uni-popup>
		<!-- #ifdef APP-PLUS -->
		<view class="advbox" v-if="showXY=='block'">
			<view class="imgbox">
				<view class="textbox">
					<view class="title">服务协议和隐私政策</view>
					<view class="main">
						请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向你提供附近的商品筛选、实时视频等服务，我们需要获取您的定位信息、相机等权限。您可以在“设置”中查看、变更、删除个人信息并管理授权。
					</view>
					<view class="main">
						您可阅读<text class="colorblue" @click="tolink('/pages/message/agreement2/agreement2')">《服务协议》</text>和<text class="colorblue" @click="tolink('/pages/message/agreement2/agreement2')">《隐私政策》</text>了解详细信息。如您同意，请点击“同意”开始接受我们的服务。
					</view>
					<view class="maskbtnbox">
						<view class="" @click="xytab(0)">暂不使用</view>
						<view class="colorblue" @click="xytab(1)">同意</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {post,get,toLogin,navigate,dateUtils,webUrl} from '@/common/util.js';
	import {debounce} from '@/common/ans-utils';
	import noData from '@/components/notData.vue'; //暂无数据
	import ansInput from '@/components/ans-input/ans-input.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import share from '@/components/share/share.vue'; //分享
	import replyItem from '@/components/reply-item.vue'; //评论组件
	import {editShareUrl} from '@/common/common'
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex';
	export default {
		components: {
			noData,
			uniLoadMore,
			ansInput,
			share,
			replyItem
		},
		data() {
			return {
				showXY:"none",//"none":不显示 "block"显示
				pageCon:0,
				navigate,
				userId: "",
				token: "",
				barHeight:0,
				searchText:'',
				page:1,
				pageSize:8,
				isLoad: false,
				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],////推荐视频
				noDataIsShow0:false,
				Page0:1,
				LoadingType0:0,//0加载前，1加载中，2没有更多了
				videoContext:null,
				onplayId:-1,//当前播放视频id
				onplayIndex:-1,//当前播放视频序号
				onplayHeight:0,//当前播放视频距离顶部的高度
				playID:"",//当前播放
				playIDtype:false,//当前播放舞曲的状态false：暂停 true：播放中
				xqUrl:[
					{
						type:0,
						url:'/pages/replylist/replylist?id='
					},
					{
						type:1,
						url:'/pages/replylist/replylist?id='
					},
					{
						type:2,
						url:'/pages/video/videoDetails/videoDetails?id='
					},
					{
						type:3,
						url:'/pages/music/playMusic/playMusic?type=share&id='
					},
					{
						type:4,
						url:'/pages/shopSon/product/productDetails?proId='
					}
				],//详情链接
				isTop:false,//是否显示置顶
				ismuted:false,
				phoneheight:0,
				pageTop:0,
				IsShowReplyList:false,
				IsShowReplyBox:false,//是否显示评论按钮
				PCommentname:"",//上级评论名
				PCommentId:0,//上级评论id
				replylist:[],
				replypage:1,
				replypageSize:8,
				hasReplyData: false,
				noDataReplyIsShow: false,
				isReplyLoad:false,
				loadingReplyType: 0, //0加载前，1加载中，2没有更多了
				commenNum:0,
				FkId:0,
				placeholder:"写评论~",
				Comment:"",//评论内容
				Commenttype:0,
				isfullscreen:false,//是否全屏状态
				isControls:false,
				canSwip:true,
				timer:'',
				onHidePage:false,
				IsShowShare:false,
				shareUrl:"",
				isClick:false,
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
			var hasXY=uni.getStorageSync("showXY");console.log(hasXY,hasXY!="",hasXY!="undefined")
			if(hasXY!=""&&hasXY!="undefined"){
				this.showXY=hasXY;console.log(this.showXY,'++++++++++++++++++++++++')
			}else{
				this.showXY="block";
			}
			//#endif
			//#ifdef MP
			this.barHeight=uni.getSystemInfoSync().statusBarHeight
			//#endif
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.phoneheight=uni.getSystemInfoSync().screenHeight;
			// #ifdef H5
			this.ismuted=true;
			// #endif
			//#ifndef H5
			this.ismuted=false;
			//#endif
			if(this.pageCon){
				this.init();
			}else{
				post("System/GetOpen",{}).then(res=>{
					if(res.code==0){
						if(res.data==1){
							this.pageCon=1
						}else{
							this.pageCon=2
						}
						this.init();
					}
				})
			}
		},
		onShow(){
			this.pageCon=uni.getStorageSync("pageCon");
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.playID=uni.getStorageSync("playID");
			this.playIDtype=this.$store.state.isplayingmusic;
			this.IsShowReplyList=false;
			this.IsShowShare=false;
			this.onHidePage=false;
			this.isClick=false;
			this.isControls=false;
		},
		computed: {
		   ...mapGetters(['isplayingmusic'])
		},
		onHide() {
			clearTimeout(this.timer);
			this.onHidePage=true;
			let that=this;
			if(this.onplayId>-1){
				this.videoContext.stop();
			}
			this.datalist.forEach(function(item){
				if(item.Type==1){
					that.$set(item,'play',false);
					that.$set(item,'fixed',false);
					that.$set(item,'ispause',false);
				}
			})
			if(this.isfullscreen){
				this.videoContext.exitFullScreen()
			}
			//this.init();
		},
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			init(){
				this.recuserlist=[];//推荐用户
				this.TeacherUserList=[];//推荐的名师
				this.datalist=[];////推荐视频
				this.Page0=1;
				this.LoadingType0=0;//0加载前，1加载中，2没有更多了
				this.IsShowReplyBox=false;
				this.IsShowReplyList=false;
				this.IsShowShare=false;
				this.isClick=false;
				this.isControls=false;
				this.IndexRecommend();
				this.GetReCommendMember();
				this.getRecommendUser();
			},
			xytab(id){
				this.showXY=false;
				if(id==0){
					plus.runtime.quit();
				}else{
					uni.setStorageSync('showXY',"none");
				}
			},
			screenchange(e){
				if(e.type=="fullscreenchange"){
					//#ifdef H5
					this.ismuted=false;
					//#endif
				}else{
					//#ifdef H5
					this.ismuted=true;
					//#endif
				}
				this.isfullscreen=e.detail.fullScreen;
				this.isControls=e.detail.fullScreen;
			},
			ControlsFn(){
				this.isControls=true;
			},
			pauseVideo(id,index){
				if(!this.isfullscreen){
					this.isControls = false;
				}
				let _this=this;
				_this.onplayId=id;
				_this.onplayIndex=index;
				_this.$set(_this.datalist[index],'fixed',true);
				_this.$set(_this.datalist[index],'ispause',true);
			},
			playVideo(id,index){
				if(!this.isfullscreen){
					this.isControls = false;
				}
				let _this=this;
				if(this.playID&&this.isplayingmusic){
					this.setIsplayingmusic(false)
				}
				_this.onplayId=id;
				_this.onplayIndex=index;
				_this.$set(_this.datalist[index],'fixed',false);
				_this.$set(_this.datalist[index],'ispause',false);
			},
			endedFn(id,index){
				let _this=this;
				if(!this.isfullscreen){
					_this.$set(_this.datalist[index],'fixed',true);
					_this.$set(_this.datalist[index],'ispause',true);
				}
			},
			// 搜索完成
			searchConfirm(val){
				this.searchText = val;
				this.datalist=[];////推荐视频
				this.Page0=1;
				this.LoadingType0=0;//0加载前，1加载中，2没有更多了
				this.IndexRecommend();
			},
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			toRec(type,id){
				let _this=this;
				uni.navigateTo({
					url: _this.xqUrl[type].url+id
				})
			},
			//获取推荐名师
			async getRecommendUser(){
				let res = await post("User/GetDancerList", {
					IsRecommend:1
				});
				this.TeacherUserList=res.data;
			},
			//获取推荐大人
			async GetReCommendMember(){
				let result = await post("User/GetReCommendMember", {
					UserId:this.userId,
					Token:this.token,
					page:1,
					pageSize:20
				});
				if(result.code==0){
					this.recuserlist=result.data;
				}
			},
			closeuser(index){
				this.recuserlist.splice(index,1);
			},
			//推荐视频
			async IndexRecommend(){
				let result = await post("Find/IndexRecommend", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page0,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					let _this=this;
					if(result.data.length>0){
						_this.noDataIsShow0= false;
						result.data.forEach(function(item,index){
							if(item.Type==1){
								_this.$set(item,'play',false);
								_this.$set(item,'fixed',false);
								_this.$set(item,'ispause',false);
							}
						})
					}
					if (result.data.length == 0 && this.Page0 == 1) {
						this.noDataIsShow0 = true;
					}
					if (this.Page0 === 1) {
						this.datalist = result.data;
					}
					if (this.Page0 > 1) {
						this.datalist.splice(this.pageSize*(this.Page0-1),this.pageSize);
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (!result.isok) {
						this.LoadingType0 = 2;
					} else {
						this.LoadingType0 = 0
					}
				}
			},
			playBtn(index,id){
				console.log("点击播放")
				let _this = this;
				_this.onplayId=id;
				_this.isControls = false;
				_this.datalist.forEach(function(item){
					if(id==item.Id){
						_this.$set(item,'play',true);
						_this.$set(item,'fixed',false);
						setTimeout(()=>{
							_this.videoContext=uni.createVideoContext('video'+item.Id);
							if(!_this.isClick){
								_this.videoContext.play();
							}else{
								_this.videoContext.pause();
								// _this.$set(item,'fixed',true);
								// _this.$set(item,'ispause',true);
							}
						},600)
					}else{
						_this.$set(item,'play',false);
						_this.$set(item,'fixed',false);
						_this.$set(item,'ispause',false);
					}
				})
			},
			playAudio(item){
				let src=item.VideoUrl,
				    id=item.Id,
					PicImg=item.PicImg,
					title=item.Title;
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
					console.log("切换了歌曲")
					this.playIDtype=true;
					this.$au_player.src = src;
					this.$au_player.play();
				}
				let list=[{
					Id:item.Id,
					Name:item.Title,
					Audio:item.VideoUrl
				}];
				this.setAudiolist(list);
				this.setIsplayactive(true)
				this.setIsplayingmusic(this.playIDtype)
				Vue.prototype.cusPlay = this.onPlayFn
				Vue.prototype.cusTimeUpdate = this.onTimeUpdateFn
				Vue.prototype.cusEnded = this.onEndedFn
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
			//关注取消关注 followtype 1推荐视频用户 2名师 3机构 4推荐用户
			async flow(id,index,followtype){
				let result = await post("Find/FollowOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId":id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(followtype==1){
						let isf=0;
						if(this.datalist[index].IsFollow==0){
							isf=1;
						}else{
							isf=0;
						}
						_this.datalist.forEach(function(item){
							if(item.MemberId==id){
								_this.$set(item,"IsFollow",isf)
							}
						})
					}else if(followtype==2){
						if(this.TeacherList[index].IsFollow==0){
							this.$set(this.TeacherList[index],"IsFollow",1)
						}else{
							this.$set(this.TeacherList[index],"IsFollow",0)
						}
					}else if(followtype==3){
						if(this.JiGouList[index].IsFollow==0){
							this.$set(this.JiGouList[index],"IsFollow",1)
						}else{
							this.$set(this.JiGouList[index],"IsFollow",0)
						}
					}else if(followtype==4){
						if(this.recuserlist[index].IsFollow==0){
							this.$set(this.recuserlist[index],"IsFollow",1)
						}else{
							this.$set(this.recuserlist[index],"IsFollow",0)
						}
					}
					
				}else if(result.code==2){
					uni.hideToast();
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				}
			},
			//发现收藏和取消收藏
			async CollectBtn(id,index,type){
				let result;
				if(type==2){
					result = await post("Course/CourseCollection", {
						"UserId": this.userId,
						"Token": this.token,
						"OutlineId":id
					});
				}else{
					result = await post("Find/CollectOperation", {
						"UserId": this.userId,
						"Token": this.token,
						"FindId":id
					});
				}
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg
					})
					if(this.datalist[index].IsCollect==0){
						this.$set(this.datalist[index],"IsCollect",1)
					}else{
						this.$set(this.datalist[index],"IsCollect",0)
					}
				}else if(result.code==2){
					uni.hideToast();
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				}
			},
			//发现点赞
			async likeBtn(id,index,type){
				let result;
				if(type==2){
					result = await post("Course/CourseOutlineLikes", {
						"UserId": this.userId,
						"Token": this.token,
						"CourseId":id
					});
				}else{
					result = await post("Find/FindlikeOperation", {
						"UserId": this.userId,
						"Token": this.token,
						"FindId":id
					});
				}
				if(result.code==0){
					let _this=this;
					let num=0;
					uni.showToast({
						title: result.msg
					})
					num=_this.datalist[index].LikeNum;
					if(this.datalist[index].IsLike==0){
						num++
						this.$set(_this.datalist[index],"IsLike",1)
					}else{
						num--
						this.$set(_this.datalist[index],"IsLike",0)
					}
					this.$set(_this.datalist[index],"LikeNum",num)
					
				}else if(result.code==2){
					uni.hideToast();
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有登录，是否重新登录？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
								  url: "/pages/login/login"
								});
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
					}).then(res=>{
						uni.navigateTo({
							url: "/pages/login/login"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				}
			},
			scanCode(){
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			},
			popShare(url){
				this.isClick=true;
				this.shareUrl=url+'&inviteCode='+uni.getStorageSync('myInviteCode');
				setTimeout(()=>{
					if(this.onplayId>-1){
						this.videoContext.pause();
					}
					this.IsShowShare=true;
					this.$refs.sharetWin.open();
				},400)
			},
			appShare(Scene){
				if(Scene){
					uni.share({
					    provider: "weixin",
					    scene: Scene,
					    type: 0,
						title:'壹舞',
						imageUrl:'/static/logo.png',
					    href: webUrl+'/#'+this.shareUrl,
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}else{
					let txt = webUrl+'/#'+this.shareUrl;
					uni.setClipboardData({
					  data: txt,
					  success: function (res) {
					    uni.getClipboardData({ 
					      success: function (res) {
					        console.log(res.data) // data
					      }
					    })
					  }
					})
				}
			},
			showReply(id,name,type,index){
				let _this=this;
				this.isClick=true;
				this.FkId=id;
				if(type==2){
					this.Commenttype=2
				}else{
					this.Commenttype=0
				}
				if(name==""){
					this.placeholder="回复匿名";
				}else{
					this.placeholder="回复"+name;
				}
				this.noDataReplyIsShow = false;
				this.hasReplyData=false;
				this.CommnetList();	
				setTimeout(()=>{			
					console.log("this.onplayId"+this.onplayId)
					if(this.onplayId>-1){
						this.videoContext.pause();
					}
				},400)
				setTimeout(()=>{
					this.IsShowReplyList=true;
					this.$refs.ReplyListWin.open();
				},500)
			},
			//取消（统一关闭弹窗）
			hidePopup(){
				this.$refs.ReplyListWin.close();
				this.$refs.sharetWin.close();
				this.IsShowReplyList=false;
				this.IsShowShare=false;
				this.isClick=false;
				this.isControls = true;
			},
			changeClose(e){
				if(!e.show){
					this.IsShowReplyList=false;
					this.IsShowShare=false;
					this.isClick=false;
					this.isControls = true;
				}
			},
			//显示评论按钮
			showReplyBox(){
				if(toLogin()){
					this.IsShowReplyBox=true;
				}
			},
			Sendreplay(e){
				console.log(e)
				if(e[1]==""){
					this.placeholder="回复匿名";
					if(e[2]==true){
						this.PCommentname="@匿名"+"#$#"
					}
				}else{
					this.placeholder="回复"+e[1];
					if(e[2]==true){
						this.PCommentname="@"+e[1]+"#$#";
					}
				}
				this.PCommentId=e[0];
				this.IsShowReplyBox=true;
			},
			//取消评论
			CancelReply(){
				this.placeholder="写评论~";
				this.IsShowReplyBox=false;
				this.PCommentId=0;
				this.Comment="";
				this.PCommentname="";
			},
			async CommnetList(){
				let result = await post("Find/CommnetList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.replypage,
					"pageSize": this.replypageSize,
					"FkId":this.FkId,
					"TypeInt":this.Commenttype
				});
				if(result.code==0){
					this.commenNum=result.count;
					if (result.data.length > 0) {
						let _this=this;
						this.hasReplyData = true;
						this.noDataReplyIsShow = false;
						result.data.forEach(function(item) {
							item.AddTime=dateUtils.format(item.AddTime);
							_this.$set(item, "imgArr",item.ImgList.split(","));
							_this.$set(item, "isSHOW",false);
							item.MyCommnetList.forEach(function(item2) {
								item2.AddTime=dateUtils.format(item2.AddTime);
								let txt =item2.Comment.split("#$#");
								if(txt.length==2){
									_this.$set(item2, "Comment",txt[1]);
									_this.$set(item2, "pname",txt[0]);
								}else{
									_this.$set(item2, "Comment",txt[0]);
									_this.$set(item2, "pname","");
								}
							})
						})
					}
					if (result.data.length == 0 && this.replypage == 1) {
						this.noDataReplyIsShow = true;
						this.hasReplyData = false;
					}
					if (this.replypage === 1) {
						this.replylist = result.data;
					}
					if (this.replypage > 1) {
						this.replylist = this.replylist.concat(
							result.data
						);
					}
					if (result.data.length <this.replypageSize) {
						this.isReplyLoad = false;
						this.loadingReplyType=2;
					} else {
						this.isReplyLoad = true;
						this.loadingReplyType=0;
					} 
				}
			},
			loadMoreReply(){
				if(this.isReplyLoad){
					this.loadingReplyType=1
					this.replypage++
					this.CommnetList()
				}else{
					this.loadingReplyType=2
				}
				// uni.navigateTo({
				// 	url:'/pages/replylist/replylist?id='+this.FkId
				// })
			},
			// 发表评论
			async CommentOperation(){
				let result = await post("Find/CommentOperation",{
					"UserId": this.userId,
					"Token": this.token,
					"FkId":this.FkId,
					"TypeInt":this.Commenttype,
					"ParentCommentId":this.PCommentId,
					"Comment":this.Comment
				});
				if(result.code===0){
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
					//更新评论列表，并清空评论内容
					this.replylist=[];
					this.replypage=1;
					this.CommnetList();
					this.CancelReply();
					this.IndexRecommend();
				}
			},
			Send(){
				if(this.Comment!=""){
					if(this.PCommentname!=""){
						this.Comment=this.PCommentname+this.Comment;
					}
					this.CommentOperation();
				}else{
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
						duration: 2000
					});
				}
			},
			//返回顶部
			Top(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.isControls = true;
			this.init();
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom() {
			if(this.LoadingType0==2) return;//0加载前，1加载中，2没有更多了
			this.Page0++;
			this.IndexRecommend();
		},
		//监听页面滚动
        onPageScroll(e){
			let _this=this;
			if(e.scrollTop>300){
				this.isTop=true;
			}else{
				this.isTop=false;
			}
			if(_this.IsShowReplyList||_this.isfullscreen||_this.onHidePage||_this.IsShowShare) return;
		const query = uni.createSelectorQuery().in(_this);
		clearTimeout(_this.timer)// 每次滚动前 清除一次
		_this.canSwip=false;
		_this.isControls = false;
		_this.timer=setTimeout(function(){
			console.log("滚动停止")
			if(_this.isClick) return;
			_this.canSwip=true;
			_this.datalist.forEach(function(item,index){
				let itemh=0;
				let h=0;
				if(item.Type==1){
					query.select('#box'+item.Id).boundingClientRect(data => {
						h=_this.phoneheight-data.height;
						itemh=data.top;
						if(itemh<h&&itemh>44&&!item.ispause){
							let Pitem={}
							if(index==0){
								Pitem=_this.datalist[0];
								_this.$set(item,'play',true);
								_this.$set(item,'fixed',false);
							}else if(index==1){
								if(_this.datalist[0].Type==1){
									if(!_this.datalist[0].play){
										_this.$set(item,'play',true);
										_this.$set(item,'fixed',false);
									}else{
										_this.$set(item,'play',false);
										_this.$set(item,'fixed',false);
										_this.$set(item,'ispause',false);
									}
								}else{
									_this.$set(item,'play',true);
									_this.$set(item,'fixed',false);
								}
							}else{
								Pitem=_this.datalist[index-1];
								if(Pitem.Type==1){
									_this.$set(_this.datalist[index-1],'play',false);
									_this.$set(_this.datalist[index-1],'fixed',false);
									_this.$set(_this.datalist[index-1],'ispause',false);
								}
								_this.$set(item,'play',true);
								_this.$set(item,'fixed',false);
							}
							setTimeout(()=>{
								_this.onplayId=item.Id;
								if(!_this.isClick){
									_this.videoContext=uni.createVideoContext('video'+item.Id);
									_this.videoContext.play();
								}else{
									// _this.videoContext.pause();
									_this.$set(item,'fixed',true);
									_this.$set(item,'ispause',true);
								};
							},600)
						}else{
							_this.$set(item,'fixed',false);
							_this.$set(item,'play',false);
							_this.$set(item,'ispause',false);
						}
					}).exec();
				}
			})
		},500)
		// if(e.scrollTop>this.pageTop+40||e.scrollTop<this.pageTop-40){
		//  		this.pageTop=e.scrollTop
				
		// 	}
		},
		
		onShareAppMessage: function(res) {
				if (res.from === 'button') {
					let param = res.target.dataset.param
					let arr = param.split('&')
					return {
						title: '壹舞',
						path: editShareUrl(this.xqUrl[arr[0]].url+arr[1]),
						success: function(res) {}
					}
				}
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	/* #ifndef H5 */
	page{
		touch-action: none
	}
	/* #endif */
	.uploadbtn{
		position: fixed;
		right: 20upx;
		bottom: 20upx;
		/* #ifdef H5 */
		bottom: 160upx;
		/* #endif */
		width: 100upx;
		height: 100upx;
		line-height:1;
		color: #fff;
		font-size: 22upx;
		background: $primary;
		border-radius: 50%;
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
		z-index: 9;
		.uni-icon{
			font-weight: bold;
			font-size: 52upx;
			line-height: .8;
		}
		.icon{
			display: block;
			height: 40upx;
			width: 40upx;
			margin-bottom: 8upx;
		}
	}
	.cover-mark{
		position:absolute;
		width:100%;
		height:100%;
		left:0;top:0;
		//background: rgba(0,255,0,.5);
	}
	.foot-reply{
		bottom: 0;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
	}
	.uni-modal-ReplyBox{
		background:#fff;
		border-radius: 10px 10px 0 0;
		min-height: 40vh;
		.uni-modal__hd{
			text-align: center;
			font-size: 32upx;
			line-height: 110upx;
		}
		.uni-modal__bd{
			max-height: 60vh;
		}
		.close{
			position: absolute;
			left: 0;
			top: 0;
			padding: 0 30upx;
			line-height: 110upx;
		}
	}
	.uni-popup-share {
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
		border-radius: 20upx 20upx 0 0;
		text-align: center;
		.pop-hd{ 
			font-size: 32upx;
			line-height: 110upx;
		}
		.sharelist{
				padding: 20upx 30upx;
				.share-item{ width: 25%; margin-bottom: 20upx;}
				.imgico{ display: block; width: 100upx; height: 100upx; margin: 0 auto;}
				.txt{ color: #333; font-size: 26upx;}
			}
		.uni-close-bottom{ height: 100upx; line-height: 100upx; width: 100%; position: absolute;bottom: 0; left: 0; font-size: 30upx; border-top: 1px solid #eee;color: #999;}
	}
	.staticPage{
		.itembox{
			.hd{
				color: $primary;
				font-weight: bold;
				font-size: 36upx;
				padding: 30upx;
			}
			.txtbox{
				.p{
					font-size: 30upx;
					margin-bottom: 10upx;
					text-align: justify;
				}
			}
			.icons{
				text-align: center;
				margin-top: 30upx;
				.item{
					width: 33.33%;
				}
				.icoimg{
					width: 128upx;
					margin-bottom: 20upx;
				}
				.txt{
					line-height: 1.5;
				}
				.zh{ 
					font-size: 30upx;display: block;
				}
				.en{
					font-size: 24upx;
				}
				&.jigou{
					padding: 0 20upx;
					.item{
						width: 20%;
						.icoimg{
							width: 120upx;
							margin-bottom: 20upx;
						}
					}	
				}
			}
		}
		.youshi{
			background: url(http://m.dance-one.com/static/img/item3.png) center center no-repeat;
			background-size: cover;
			padding: 40upx 30upx;
			.hd{
				color: #fff !important;
			}
			.item{
				background: rgba(0,0,0,.3);
				padding: 40upx 20upx 30upx;
				margin: 0 1px;
				height: 380upx;
				.txt{
					.zh{
						color: #fff;
						font-size: 24upx;
					}
					
				}
			}
		}
	}
	
</style>
