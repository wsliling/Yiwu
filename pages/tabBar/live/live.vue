<template>
	<view class="content">
		<block v-if="pageCon==1">
		<view class="head" :style="{'padding-top':barHeight+'px'}">
			<view class="index_head flex-between" style="padding: 0 15px;">
				<view class="seachbox">
					<text class="uni-icon uni-icon-search"></text>
					<ans-input placeholder="请输入搜索内容" :value="searchText" @confirm="searchConfirm" @clear="clearText" class="flex1"></ans-input>
				</view>
				<!-- #ifndef H5 -->
				<view class="head_r" @click="scanCode">
					<view class="scan uni-icon uni-icon-scan"></view>
				</view>
				<!-- #endif -->
			</view>
			<view style="position: relative; width: 100%; overflow-x: hidden;">
				<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft" style="padding: 0 50px 0 5px;">
					<view v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==tab.Id ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(tab.Id,index)" style="width: auto; padding: 0 22px;">{{tab.TypeName}}</view>
					<!-- <view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view> -->
				</scroll-view>
				<view class="flex-column menuIco" id="menu" @click="isshowAll=!isshowAll">
					<block v-if="!isshowAll">
						<view class="line1"></view>
						<view class="line2"></view>
						<view class="line3"></view>
					</block>
					<text v-if="isshowAll" class="iconfont icon-close"></text>
				</view>
			</view>
			<view class="showClassify" :style="{'top':(44+barHeight)+'px'}" v-if="isshowAll">
				<view class="allhd bg_fff">请选择</view>
				<view class="flex flexWrap menubox">
					<view v-for="(tab,index) in tabnav" :key="index" :class="['btn',tabIndex==tab.Id ? 'active' : '']" @click="tapTab(tab.Id,index)">{{tab.TypeName}}</view>
				</view>
			</view>
		</view>
		<view :style="{'height':(84+barHeight)+'px'}"></view>
		</block>
		<block v-if="pageCon==2">
			<view class="head" :style="{'padding-top':barHeight+'px'}">
				<view class="title center" style="height: 44px; line-height: 44px; font-size: 16px; font-weight: bold;border-bottom: 1px solid #eee;">Danceone</view>
			</view>
			<view :style="{'height':(44+barHeight)+'px'}"></view>
		</block>
		<!-- 最新 -->
		<view class="index-item index-item-0 bg_fff"  v-if="tabIndex==5">
			<view class="Yi-courselist flex-between">
				<view class="left-list">
					<block v-for="(item,index) in zxlist" :key="index">
						<view class="item" v-if="index%2==0" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
							<view class="maxpic">
								<image :src="item.PicImg" mode="widthFix"></image>
								<!-- <view class="isplay"></view> -->
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">{{item.Title}}</view>
								<view class="item_auther flex">
									<image class="tx" :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
									<view class="name uni-ellipsis">{{item.NickName}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="right-list">
					<block v-for="(item,index) in zxlist" :key="index">
						<view class="item" v-if="index%2==1" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
							<view class="maxpic">
								<image :src="item.PicImg" mode="widthFix"></image>
								<!-- <view class="isplay"></view> -->
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">{{item.Title}}</view>
								<view class="item_auther flex">
									<image class="tx" :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
									<view class="name uni-ellipsis">{{item.NickName}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>	
			</view>
			<view class="uni-tab-bar-loading" v-if="zxlist.length">
				<uni-load-more :loadingType="LoadingType5"></uni-load-more>
			</view>
			<noData v-if="noDataIsShow5"></noData>
		</view>
		<!-- 关注 -->
		<view class="index-item index-item-0" v-if="tabIndex==6">
			<block v-if="datalist.length">
				<block v-for="(item,index) in datalist" :key="index">
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
						<view class="tag_btns" v-if="item.Keywords">
							<block v-for="(i,e) in item.Keywords" :key="e">
								<text>#{{i}}#</text>
							</block>
						</view>
						<view :class="['maxpic mv',IsEdit||item.fixed?'dis':'']" v-if="item.Type==1" :id="'box'+item.Id" @click.stop="">
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
							<view @click.stop="popShare(xqUrl[item.Type].url+item.Id,item.Type,item.VideoUrl)">
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
				<view class="uni-tab-bar-loading">
					<uni-load-more :loadingType="LoadingType6"></uni-load-more>
				</view>	
			</block>
			<noData v-if="noDataIsShow6" :tipsTitle="'还没有关注哦'"></noData>
		</view>
		<!-- 资讯	 -->
		<view class="index-item index-item-1 bg_fff" v-if="tabIndex==4">
			<view class="Yi-newslist" >
				<view class="Yi-media" v-for="(item,index) in NewsList" :key="index" @click="tolink('/pages/msgDetail/msgDetail?id='+item.Id)">
					<view class="media-bd">
						<view class="desc">
							{{item.Title}}
						</view>
						<view class="maxpic maxh" v-if="item.Logo">
							<image :src="item.Logo" mode="widthFix"></image>
						</view>
						<view class="media-ft flex-between">
							<view class="ft_l flex-start">
								<view class="txt_info">{{item.Source}}</view>
								<view class="txt_info">{{item.AddTime}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="NewsList.length">
				<uni-load-more :loadingType="LoadingType4"></uni-load-more>
			</view>	
			<noData v-if="!NewsList.length"></noData>
		</view>
		<!-- 名师	 -->
		<view class="index-item index-item-2" v-if="tabIndex==2">
			<view class="Yi-Userlist">
				<view class="user-item uni-bg-white uni-mb10" v-for="(item,index) in TeacherList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.UserId)">
					<view class="flex-between">
						<view class="author flex-start">
							<view class="tx">
								<image :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image>
								<!-- #ifndef MP-WEIXIN -->
								<view class="islive" v-if="item.Flag==1" @click.stop="navigate('liveplay/live',{id:item.UserId})">
									<view class="line line1"></view>
									<view class="line line2"></view>
									<view class="line line3"></view>
									<view class="txt">直播</view>
								</view>
								<!-- #endif -->
							</view>
							<view class="info">
								<view class="name uni-ellipsis">{{item.Name}}</view>
								<view class="fz12 c_999">关注人数：{{item.FansNum}}</view>
							</view>
						</view>
						<view v-if="item.IsMy==0" @click.stop="flow(item.UserId,index,2)" :class="['flow','active',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
					</view>
					<view class="introduce uni-mt10 uni-ellipsis2">
						{{item.Introduction}}
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="TeacherList.length">
				<uni-load-more :loadingType="LoadingType2"></uni-load-more>
			</view>
			<noData v-if="!TeacherList.length"></noData>
		</view>
		<!-- 机构	 -->
		<view class="index-item index-item-3" v-if="tabIndex==3">
			<view class="Yi-mechanismlist">
				<view class="mechanism-item uni-bg-white uni-mb10" v-for="(item,index) in JiGouList" :key="index" @click="tolink('/pages/homepage/homepage?id='+item.Id)">
					<view class="flex-between">
						<view class="author flex-start">
							<view class="tx"><image :src="item.Avatar||'http://m.dance-one.com/static/default.png'" mode="aspectFill"></image></view>
							<view class="info">
								<view class="name uni-ellipsis">{{item.Name}}</view>
								<view class="fz12 c_999">关注人数：{{item.FansNum}}</view>
								<view class="introduce uni-ellipsis">
									{{item.Introduction}}
								</view>
							</view>
						</view>
						<view v-if="item.IsMy==0" @click.stop="flow(item.Id,index,3)" :class="['flow','active',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="JiGouList.length">
				<uni-load-more :loadingType="LoadingType3"></uni-load-more>
			</view>
			<noData v-if="!JiGouList.length"></noData>
		</view>
		<!-- 课程	 -->
		<view class="index-item index-item-4 bg_fff" v-if="tabIndex==1">
			<view class="Yi-courselist flex-between">
				<view class="left-list">
					<block v-for="(item,index) in CourseList" :key="index">
						<view class="item" v-if="index%2==0" @click="tolink('/pages/video/videoDetails/videoDetails?id='+item.Id)">
							<view class="maxpic">
								<image :src="item.PicImg" mode="widthFix"></image>
								<view class="isplay"></view>
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">{{item.Title}}</view>
								<view class="item_total">
									<view class="item_market">{{item.Is_Charge==1?item.SalesNum+'人购买':item.Hits+'人点击'}}</view>
									<span class="item_price" v-if="false">{{item.Is_Charge==1?'￥'+item.Price:'免费'}}</span>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="right-list">
					<block v-for="(item,index) in CourseList" :key="index">
						<view class="item" v-if="index%2==1" @click="tolink('/pages/video/videoDetails/videoDetails?id='+item.Id)">
							<view class="maxpic">
								<image :src="item.PicImg" mode="widthFix"></image>
								<view class="isplay"></view>
							</view>
							<view class="item_info">
								<view class="item_title uni-ellipsis">{{item.Title}}</view>
								<view class="item_total">
									<view class="item_market">{{item.Is_Charge==1?item.SalesNum+'人购买':item.Hits+'人点击'}}</view>
									<span class="item_price" v-if="false">{{item.Is_Charge==1?'￥'+item.Price:'免费'}}</span>
								</view>
							</view>
						</view>
					</block>
				</view>	
			</view>
			<view class="uni-tab-bar-loading" v-if="CourseList.length">
				<uni-load-more :loadingType="LoadingType1"></uni-load-more>
			</view>
			<noData v-if="!CourseList.length"></noData>
		</view>
		<!-- 视频-->
		<view class="videolist" v-if="tabIndex==7">
			<view class="Yi-media bg_fff uni-mb5" v-for="(item,index) in datalist" :key="index">
				<view class="media-hd flex-between">
					<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id='+item.MemberId)">
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
					<view v-if="item.IsMy==0" @click="flow(item.MemberId,index,1)" :class="['flow','active',item.IsFollow==1?'active':'']">{{item.IsFollow==1?'已关注':'关注'}}</view>
				</view>
				<view class="media-bd" @click="tolink('/pages/replylist/replylist?id='+item.Id)">
					<view class="desc uni-ellipsis2">
						{{item.Title}}
					</view>
					<view class="tag_btns" v-if="item.Keywords">
						<block v-for="(i,e) in item.Keywords" :key="e">
							<text>#{{i}}#</text>
						</block>
					</view>
					<view :class="['maxpic mv',IsEdit||item.fixed?'dis':'']" v-if="item.VideoUrl" :id="'box'+item.Id" @click.stop="">
						<view v-if="!item.play||item.fixed" class="isplay" @click.stop="playBtn(index,item.Id)"></view>
						<image class="postpic" :src="item.PicImg" mode="widthFix"></image>
						<video v-if="item.play&&!onHidePage" :src="item.VideoUrl" :controls="isControls" style="width: 100%;height: 100%;" :muted="ismuted" @play="playVideo(item.Id,index)" @pause="pauseVideo(item.Id,index)" @fullscreenchange="screenchange" :id="'video'+item.Id" :show-mute-btn="true" object-fit="contain" :show-center-play-btn="false" @ended="endedFn(item.Id,index)" @click.stop="">
							<cover-view class="cover-mark" @click.stop="ControlsFn" v-if="!isControls&&!isClick"></cover-view>
						</video>
					</view>
					
					<view class="media-ft flex-between">
						<view class="ft_l flex-start">
							<view @click.stop="likeBtn(item.Id,index)" :class="['txt_info like',item.IsLike?'active':'']">{{item.LikeNum}}</view>
							<view class="txt_info reply" @click.stop="showReply(item.Id,item.NickName,index)">{{item.CommentNum}}</view>
							<!-- #ifdef APP-PLUS -->
							<view @click.stop="popShare(xqUrl[1].url+item.Id,item.Type,item.VideoUrl)">
								<view class="txt_info share"></view>
							</view>
							<!-- #endif -->
							<!-- #ifndef APP-PLUS -->
							<share :url="xqUrl[1].url+item.Id" :param="'1&'+item.Id">
								<view class="txt_info share"></view>
							</share>
							<!-- #endif -->
						</view>
						<view class="ft_r">
							<view @click.stop="CollectBtn(item.Id,index)" :class="['txt_info sign',item.IsCollect==1?'active':'']"></view>
						</view>
					</view>
					<view class="likenum" v-if="item.LikeNum>0">被{{item.LikeNum}}人赞过</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="datalist.length">
				<uni-load-more :loadingType="LoadingType6"></uni-load-more>
			</view>
			<noData v-if="noDataIsShow6"></noData>
		</view>
		
		<view class="uploadbtn flex-column" v-if="pageCon==1" @click="openAttestation"><text class="uni-icon uni-icon-plusempty"></text></view>
		<playerMin :pagetype="'share'"></playerMin>
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
						<view class="share-item" @click.stop="appdown()">
							<image class="imgico" src="http://m.dance-one.com/static/appdown.png" mode="aspectFit"></image>
							<text class="txt">下载</text>
						</view>
					</view>
					<view style="height: 100upx;"></view>
					<view class="uni-close-bottom" @click.stop="hidePopup">关闭</view>
			   </view>
		</uni-popup>
	</view>
</template>

<script>
	import {post,get,toLogin,navigate,dateUtils,webUrl,downVideo} from '@/common/util.js';
	import noData from '@/components/notData.vue'; //暂无数据
	import ansInput from '@/components/ans-input/ans-input.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import share from '@/components/share/share.vue'; //加载更多
	import replyItem from '@/components/reply-item.vue'; //评论组件
	import {editShareUrl} from '@/common/common'
	import Vue from 'vue'
	import {mapGetters,mapMutations} from 'vuex';
	export default {
		components: {
			noData,
			uniLoadMore,
			ansInput,share,
			replyItem
		},
		data() {
			return {
				pageCon:0,
				navigate,
				userId: "",
				token: "",
				isshowAll:false,
				barHeight:0,
				searchText:'',
				scrollLeft: 0,
				tabIndex:5,
				tabnav:[
					{
						Id:5,
						TypeName:"最新"
					},
					{
						Id:6,
						TypeName:"关注"
					},
					{
						Id:7,
						TypeName:"视频"
					},
					// {
					// 	Id:1,
					// 	TypeName:"课程"
					// }
					// ,{
					// 	Id:2,
					// 	TypeName:"名师"
					// },
					// {
					// 	Id:3,
					// 	TypeName:"机构"
					// },
					// {
					// 	Id:4,
					// 	TypeName:"资讯"
					// }
				],
				page:1,
				pageSize:8,
				isLoad: false,
				recuserlist:[],//推荐用户
				TeacherUserList:[],//推荐的名师
				datalist:[],//视频
				zxlist:[],//最新
				NewsList:[],//资讯
				Page1:1,
				LoadingType1:0,//0加载前，1加载中，2没有更多了
				TeacherList:[],//名师
				Page2:1,
				LoadingType2:0,//0加载前，1加载中，2没有更多了
				JiGouList:[],//机构
				Page3:1,
				LoadingType3:0,//0加载前，1加载中，2没有更多了
				CourseList:[],//课程
				Page4:1,
				LoadingType4:0,//0加载前，1加载中，2没有更多了
				Page5:1,
				LoadingType5:0,//0加载前，1加载中，2没有更多了
				noDataIsShow5:false,
				Page6:1,
				LoadingType6:0,//0加载前，1加载中，2没有更多了
				noDataIsShow6:false,
				videoContext:null,
				IsEdit:false,
				onplayId:-1,//当前播放视频id
				onplayIndex:-1,//当前播放视频序号
				index0:0,
				index1:0,
				index2:0,
				index3:0,
				index4:0,
				index5:0,
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
				durl:"",//下载路径
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			//#ifdef APP-PLUS
			this.barHeight=plus.navigator.getStatusbarHeight();
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
			if(this.pageCon==1){
				this.init(5);
			}else{
				this.tabIndex=4;
				this.init(4);
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
			...mapGetters(['isplayingmusic']),
		  tabStyle(){
		    return ((750/this.tabnav.length)*(this.tabIndex-1))+(((750/this.tabnav.length)-68)/2)
		  }
		},
		onHide(){
			 clearTimeout(this.timer);
			 let that=this;
			 if(this.onplayId>-1){
			 	this.videoContext.stop();
			 }
			 if(this.tabIndex>5){
				 this.onHidePage=true;
				 this.datalist.forEach(function(item){
					 if(that.tabIndex==7){
					 	that.$set(item,'Type',1);
						that.$set(item,'play',false);
						that.$set(item,'fixed',false);
						that.$set(item,'ispause',false);
					 }else{
						if(item.Type==1){
							that.$set(item,'play',false);
							that.$set(item,'fixed',false);
							that.$set(item,'ispause',false);
						}
					 }
				 })
				 if(this.isfullscreen){
					 this.videoContext.exitFullScreen()
				 }
				// this.init(this.tabIndex);
			 }
			
		 },
		methods: {
			...mapMutations(['setAudiolist','setPlaydetail','setIsplayingmusic','setIsplayactive']),
			init(index){
				if(index==4){
					this.NewsList=[];//资讯
					this.Page4=1;
					this.LoadingType4=0;//0加载前，1加载中，2没有更多了
					this.YWNewsList();
				}
				if(index==2){
					this.TeacherList=[];//名师
					this.Page2=1;
					this.LoadingType2=0;
					this.GetTeacher();
				}
				if(index==3){
					this.JiGouList=[];//机构
					this.Page3=1;
					this.LoadingType3=0;
					this.GetJiGouList();
				}
				if(index==1){
					this.CourseList=[];//课程
					this.Page1=1;
					this.LoadingType1=0;
					this.GetCourseList();
				}
				if(index==5){
					this.zxlist=[];//最新
					this.Page5=1;
					this.LoadingType5=0;
					this.GETzxlist();
				}
				if(index==6||index==7){
					this.datalist=[];//关注、视频
					this.Page6=1;
					this.LoadingType6=0;//0加载前，1加载中，2没有更多了
					this.IsShowReplyBox=false;
					this.IsShowReplyList=false;
					this.IsShowShare=false;
					this.isClick=false;
					this.isControls=false;
					this.GETdatalist();
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
				this.page=1;
				switch(this.tabIndex*1){
					case 1:
						this.CourseList=[];//课程
						this.Page1=1;
						this.LoadingType1=0;
						this.GetCourseList();
						break;
					case 2:
						this.TeacherList=[];//名师
						this.Page2=1;
						this.LoadingType2=0;
						this.GetTeacher();
						break;
					case 3:
						this.JiGouList=[];//机构
						this.Page3=1;
						this.LoadingType3=0;
						this.GetJiGouList();
						break;
					case 4:
						this.NewsList=[];//资讯
						this.Page4=1;
						this.LoadingType4=0;//0加载前，1加载中，2没有更多了
						this.YWNewsList();
						break;
					case 5:
						this.zxlist=[];//最新
						this.Page5=1;
						this.LoadingType5=0;//0加载前，1加载中，2没有更多了
						this.GETzxlist();
						break;	
					default :
						this.datalist=[];//视频
						this.Page6=1;
						this.LoadingType6=0;//0加载前，1加载中，2没有更多了
						this.GETdatalist();
						break;
				}
			},
			clearText(){
				this.searchText="";
				this.init(this.tabIndex);
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
			tapTab(id,index) { //点击tab-bar
				let _this = this;
				if (this.tabIndex === id) {
					return false;
				} else {
					if(this.onplayIndex>-1){
						this.videoContext.stop();
						// this.$set(_this.datalist[_this.onplayIndex],'fixed',false);
						// this.$set(_this.datalist[_this.onplayIndex],'play',false);
					}
					this.tabIndex = id;
					this.setScrollLeft(index);
					if((this.index1==0&&id==1)||(this.index2==0&&id==2)||(this.index3==0&&id==3)||(this.index4==0&&id==4)||(this.index5==0&&id==5)||id==6||id==7){
						this.init(id);
					}
				}
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				let btnElement = await this.getWidth('menu');
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width+btnElement.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
				console.log("scrollLeft"+this.scrollLeft)
			},
			getWidth(id) { //得到元素的宽
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
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
			playBtn(index,id){
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
					this.playIDtype=true;
					this.$au_player.src = src;
					this.$au_player.play();
				}	
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
			//分页最新
			async GETzxlist(){
				this.index5++;
				let result = await post("Find/VideoList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page5,
					pageSize:this.pageSize,
					IsNews:1
				});
				if (result.code === 0) {
					let _this=this;
					if(result.data.length>0){
						this.noDataIsShow5= false;
						result.data.forEach(function(item){
							item.Title=decodeURIComponent(item.Title)
						})
					}
					if (result.data.length == 0 && this.Page5 == 1) {
						this.noDataIsShow5 = true;
					}
					if (this.Page5 === 1) {
						this.zxlist = result.data;
					}
					if (this.Page5 > 1) {
						this.zxlist = this.zxlist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType5 = 2;
					} else {
						this.LoadingType5 = 0
					}
				}
			},
			//分页获取资讯
			async YWNewsList(){
				this.index4++;
				let result = await post("News/YWNewsList", {
					UserId:this.userId,
					Token:this.token,
					Keywords:this.searchText,
					page:this.Page4,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page4 === 1) {
						this.NewsList = result.data;
					}
					if (this.Page4 > 1) {
						this.NewsList = this.NewsList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType4 = 2;
					} else {
						this.LoadingType4 = 0
					}
				}
			},
			//分页视频
			async GETdatalist(){
				let json={
						"UserId": this.userId,
						"Token": this.token,
						"page": this.Page6,
						"pageSize": this.pageSize,
						"SearchKey":this.searchText,
					};
				let url='';
				if(this.tabIndex==6){
					url='Find/IndexRecommend';
					json['IsFollow']=1
				}else if(this.tabIndex==7){
					url='Find/VideoList';
					// json['IsALL']=1;
				}
				let result =await post(url,json);
				if (result.code === 0) {
					let _this=this;
					if(result.data.length>0){
						this.noDataIsShow6= false;
						result.data.forEach(function(item){
							if(_this.tabIndex==7){
								_this.$set(item,'Type',1);
								_this.$set(item,'play',false);
								_this.$set(item,'fixed',false);
								_this.$set(item,'ispause',false);
							}else{
								if(item.Type==1){
									_this.$set(item,'play',false);
									_this.$set(item,'fixed',false);
									_this.$set(item,'ispause',false);
								}
							}
							item.Title=decodeURIComponent(item.Title)
						})
					}
					if (result.data.length == 0 && this.Page6 == 1) {
						this.noDataIsShow6 = true;
					}
					if (this.Page6 === 1) {
						this.datalist = result.data;
					}
					if (this.Page6 > 1) {
						this.datalist.splice(this.pageSize*(this.Page6-1),this.pageSize);
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (!result.isok) {
						this.LoadingType6 = 2;
					} else {
						this.LoadingType6 = 0
					}
				}
			},
			//分页获取名师
			async GetTeacher(){
				this.index2++;
				let result = await post("User/GetDancerList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page2,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page2 === 1) {
						this.TeacherList = result.data;
					}
					if (this.Page2 > 1) {
						this.TeacherList = this.TeacherList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType2 = 2;
					} else {
						this.LoadingType2 = 0
					}
				}
			},
			//分页获取机构
			async GetJiGouList(){
				this.index3++;
				let result = await post("User/GetJiGouList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page3,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page3 === 1) {
						this.JiGouList = result.data;
					}
					if (this.Page3 > 1) {
						this.JiGouList = this.JiGouList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType3 = 2;
					} else {
						this.LoadingType3 = 0
					}
				}
			},
			//分页获取课程
			async GetCourseList(){
				this.index1++;
				let result = await post("Course/GetCourseOutlineList", {
					UserId:this.userId,
					Token:this.token,
					SearchKey:this.searchText,
					page:this.Page1,
					pageSize:this.pageSize
				});
				if (result.code === 0) {
					if (this.Page1 === 1) {
						this.CourseList = result.data;
					}
					if (this.Page1 > 1) {
						this.CourseList = this.CourseList.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.LoadingType1 = 2;
					} else {
						this.LoadingType1 = 0
					}
				}
			},
			fun(index){
				if(index==1){
					this.GetCourseList();
				}else if(index==2){
					this.GetTeacher();
				}else if(index==3){
					this.GetJiGouList();
				}else if(index==4){
					this.YWNewsList();
				}else if(index==5){
					this.GETzxlist();
				}
				else if(index==6||index==7){
					this.GETdatalist();
				}
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
				    	 let url=res.result.split('#')[1];
				    	 if(res.scanType=="QR_CODE"){
				    		 uni.navigateTo({
				    		 	url:url
				    		 })
				    	 }
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			},
			popShare(url,type,vsrc){
				this.isClick=true;
				this.shareUrl=url+'&inviteCode='+uni.getStorageSync('myInviteCode');
				if(type==1){
					this.durl=vsrc;
				}
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
			//下载视频
			appdown(){
				let _this = this;
				downVideo(_this.durl)
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
				console.log("获取评论")
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
							item.Comment=decodeURIComponent(item.Comment);
							item.MyCommnetList.forEach(function(item2) {
								item2.AddTime=dateUtils.format(item2.AddTime);
								item2.Comment=decodeURIComponent(item2.Comment);
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
					"Comment":encodeURIComponent(this.Comment)
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
					this.GETdatalist();
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
			moveHandle2() {
				return;	
			},
			openAttestation(){
				let _this=this;
				this.IsEdit=true;
				if(uni.getStorageSync('userId')&& uni.getStorageSync('token')){
					uni.navigateTo({
						url: '/pages/video/videoUpload/videoUpload?type=0'
					})
					//let urlstr="";
					// uni.showActionSheet({
					// 	//itemList: ['拍视频', '上传课程','舞者直播','店铺直播'],
					// 	itemList: ['拍视频', '上传课程'],
					// 	success: (e) => {
					// 		console.log(e.tapIndex);
					// 		if(e.tapIndex==0){
					// 			urlstr="/pages/video/videoUpload/videoUpload?type=0";
					// 		}else if(e.tapIndex==1){
					// 			urlstr="/pages/video/videoUpload/videoUpload?type=1";
					// 		}else if(e.tapIndex==2){
					// 			// #ifndef APP-PLUS
					// 			uni.showToast({
					// 				title:'APP端才能开启直播哦~',
					// 				icon:'none'
					// 			})
					// 			// #endif
								
					// 			// #ifdef APP-PLUS
					// 			if(!uni.getStorageSync('attestation').IsDancer){
					// 				uni.showToast({
					// 					title:'需要先认证舞者哦~',
					// 					icon:'none'
					// 				})
					// 				return;
					// 			}
					// 			urlstr="/pages/livepush/livepush?type=0";
					// 			// #endif
					// 		}else if(e.tapIndex==3){
					// 			// #ifndef APP-PLUS
					// 			uni.showToast({
					// 				title:'APP端才能开启直播哦~',
					// 				icon:'none'
					// 			})
					// 			// #endif
					// 			// #ifdef APP-PLUS
					// 			if(!uni.getStorageSync('attestation').IsShop){
					// 				uni.showToast({
					// 					title:'需要先认证店铺哦~',
					// 					icon:'none'
					// 				})
					// 				return;
					// 			}
					// 			urlstr="/pages/livepush/livepush?type=1";
					// 			// #endif
					// 		}
					// 		uni.navigateTo({
					// 			url: urlstr
					// 		})
					// 	},
					// 	complete:(e)=>{
					// 		_this.IsEdit=false;
					// 	}
					// })
					
				}else{
					//#ifndef APP-PLUS
					uni.showModal({
						title:'登录提示',
						content: "您还没有登录，是否重新登录？",
						confirmColor:"#DD196D",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/login"
								})
							} else if (res.cancel) {
								_this.IsEdit=false;
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
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.init(this.tabIndex);
			uni.stopPullDownRefresh();
		},
		//上拉加载
		onReachBottom() {
			let index=this.tabIndex;
			if(index==6||index==7){
				if(this['LoadingType6']===2)return;
				this['Page6']++;
			}else{
				if(this['LoadingType'+index]===2)return;
				this['Page'+index]++;
			}
			this.fun(index);
		},
		//监听页面滚动
		onPageScroll(e){
			let _this=this;
			_this.scrollTopNum=e.scrollTop;
			if(_this.tabIndex>5){
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
								if(itemh<h&&itemh>84&&!item.ispause){
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
											//_this.videoContext.pause();
											_this.$set(item,'fixed',true);
											_this.$set(item,'ispause',true);
										}
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
				// 	this.pageTop=e.scrollTop
					
				// }
				
			}
		},
		onShareAppMessage: function(res) {
				if (res.from === 'button') {
					let param = res.target.dataset.param
					let arr = param.split('&')
					let url = '';
					if(arr.length>1){
						url = this.xqUrl[arr[0]].url+arr[1]
					}else{
						url = '/pages/replylist/replylist?id='+arr[0]
					}
					return {
						title: '壹舞',
						path: editShareUrl(url),
						success: function(res) {}
					}
				}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../index/style';
	/* #ifndef H5 */
	page{
		touch-action: none
	}
	/* #endif */
	.showClassify{
		position: absolute;
		width: 100%;
		left: 0;
		z-index: 8;
		.allhd{
			font-size: 15px;
			line-height: 40px;
			padding: 0 15px;
		}
		.menubox{
			background: #fff;
		}
		.btn{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 25%;
			height: 60px;
			&.active{
				font-size: 18px;
				font-weight: bold;
				color: $primary;
			}
		}
	}
	.menuIco{
		position: absolute;
		height: 40px;
		right: 0;
		top: 0;
		background:#fff;
		padding: 0 15px 0 10px;
		overflow: hidden;
		z-index: 9;
		align-items: flex-end;
		view{
			height: 2px;
			width: 20px;
			background: #666;
			margin: 3px 0;
			border-radius: 2px;
		}
		.line2{
			width: 17px;
		}
		&::before{
			content: "";
			display: block;
			width: 6px;
			height: 30px;
			box-shadow: 0 0 15upx rgba(0,0,0,.3);
			position: absolute;
			top: 50%;
			margin-top: -15px;
			left: -6px;
		}
	}
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
			font-size: 64upx;
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
		.pop-hd{ font-size: 32upx;line-height: 110upx;}
		.sharelist{
				padding: 20upx 30upx;
				.share-item{ width: 25%; margin-bottom: 20upx;}
				.imgico{ display: block; width: 100upx; height: 100upx; margin: 0 auto;}
				.txt{ color: #333; font-size: 26upx;}
			}
		.uni-close-bottom{ height: 100upx; line-height: 100upx; width: 100%; position: absolute;bottom: 0; left: 0; font-size: 30upx; border-top: 1px solid #eee;color: #999;}
	}
	
</style>
