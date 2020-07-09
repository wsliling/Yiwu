<template>
	<view class="swiper">
		<!-- #ifdef H5 -->
		<div class="H5video" id="H5video"  :style="{height : height + 'px'}">
			
		</div>
		<!-- #endif -->
		<!-- 底部信息 -->
		<view class="nlv-footToolbar">
			<!-- 滚动msg信息 -->
			<scroll-view class="nlv-rollMsgPanel" scroll-y show-scrollbar="false" :scroll-top="scrollTop">
				<block v-for="(msgitem, msgidx) in strArr" :key="msgidx">
					<view class="nlv-msglist">
						<view class="msg_bg"><text class="msg_name">{{msgitem.name}}</text> <text class="msg_text">{{msgitem.Info}}</text></view>
					</view>
				</block>
			</scroll-view>
			<view class="goodsbox" v-if="showgoodsbox">
				<view class="item">
					<view class="imgbox">
						<image :src="PicNo" mode="widthFix"></image>
					</view>
					<view class="txtBox">
						<view class="title uni-ellipsis">
							{{Name}}
						</view>
						<view class="price red">
							￥{{Price}}
						</view>
					</view>
				</view>
			</view>
			<view class="nlv-infobox" >
				<view class="nlv_btntool">
					<view class="btn-toolitem" @click="showGoods">
						<image src="http://www.sc-mall.net/static/icons/icon_goods.png" class="icon_goods"></image>
					</view>
				</view>
				<view class="nlv_reply" @click="Repliy"><image src="http://www.sc-mall.net/static/icons/icon_bianji.png" class="icon_bianji"></image><text class="nlv_reply_text">说点什么...</text></view>
			</view>
		</view>
		<uni-popup position="bottom" mode="fixed" :show="showPopupGoods" :h5Top="true" @hidePopup="hidePopup">
			<view class="uni-modal-gooods">
				<view class="bottom-title">共{{GoodsList.length}}件商品</view>
				<view class="uni-close-btn" @click="hidePopup">
					<view class="iconfont icon-close"></view>
				</view>
				<view class="bottom-content">
					<view class="uni-list">
						<view class="uni-list-cell" v-for="(item,index) in GoodsList" :key="index">
							<view class="item">
								<view class="imgbox">
									<image :src="item.ProductImg" mode="widthFix"></image>
								</view>
								<view class="txtBox">
									<view class="title">
										{{item.Name}}
									</view>
									<view class="price red">
										￥{{item.Price}}
									</view>
								</view>
								<view class="r_btn" @click="goUrl('/pages/productDetail/productDetail?proId='+item.Id)">
									去看看
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<view class="bottomicon"  v-if="isshowInput">
		  <view class="inputbtn">
		    <input
		      type="text"
		      placeholder="说点什么..."
		      class="input_text"
		      v-model="sendInfo"
		      confirm-type="send"
		      confirm-hold
		      @blur="blurFocus"
		      :focus="inputFocusStatus"
		      @confirm="sendMessage"
		      :cursor-spacing="10"
		    />
		    <view class="rightbtn" @click="sendMessage(sendInfo)">
				<image src="http://www.sc-mall.net/static/icons/icon_Send.png" class="sendBtn"></image>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,wssPath} from '@/common/util.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				height:'',
				mark:false,
				data:{},
				showPopupGoods:false,//弹出商品
				isshowInput:false,//弹出输入
				inputFocusStatus: false, //input对焦状态
				sendInfo: "", //发送消息的内容
				userId:"",
				token:"",
				showgoodsbox: true,
				countNum:0,
				type:0,
				SocketTask:null,
				socketStatus:false,
				strArr:[{name:"系统提示",Info:"欢迎进入直播间"}],
				Id:0,
				GoodsList:[],//商品列表
				PicNo:'',
				Price:'',
				Name:'',
				Signature:"",// 获取WebSocketId 用于身份验证
				TimeStamp:"",
				SecretKey:"",
				scrollTop:2000,//滚动到底部
			}
		},
		onLoad(e){
			// #ifdef APP-PLUS
			// #endif
			this.ShopId=e.id
		},
		onShow() {
			let res = uni.getSystemInfoSync()
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.height=res.windowHeight
			// #ifndef APP-PLUS
			// this.ShopId = this.$mp.query.ShopId
			// #endif
			console.log(this.ShopId)
			this.play()
			this.showgoodsbox=true;
			this.countTime();
			this.livemessage()
			this.goodsList()
		},
		onHide(){
			this.SocketTask.close()
		
		},
		onUnload(){
			this.SocketTask.close()
		
		},
		methods: {
			//获取商品列表
			async goodsList(){
				let res = await post('Goods/GoodsList',{
					UserId: this.userId,
					Token: this.token,
					page:1,
					pageSize: 4,
					ShopId:this.ShopId,
					IsLive:1
				})
				this.GoodsList=res.data
				this.Price=this.GoodsList[0].Price
				this.PicNo=this.GoodsList[0].ProductImg
				this.Name=this.GoodsList[0].Name
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.showPopupGoods = false;
			},
			//展示商品
			showGoods: function() {
				this.hidePopup();
				this.showPopupGoods = true;
			},
			// 获取WebSocketId 用于身份验证
			async livemessage(){
				let res =await post('User/GetWebSocketId',{
					UserId: this.userId,
					Token: this.token,
					Type:0,
					FriendId:this.ShopId
				})
				console.log(res)
				this.Signature=res.data.Signature
				this.TimeStamp=res.data.TimeStamp
				this.SecretKey=res.data.SecretKey
				this.connectSocket()
			},
			// 打开webSocket链接登录验证
			async connectSocket(){
				let that =this
				this.SocketTask=uni.connectSocket({
				    url:wssPath+'?Signature='+this.Signature,
					success:()=>{}
				})
				
				this.SocketTask.onOpen(res => {
					// console.log("open", res);
					that.socketStatus = true;
					let data=that.LoginData(1,that.TimeStamp,that.SecretKey)
					that.SocketTask.send({data:JSON.stringify(data)})
					console.log("发送数据",res);
					// console.log(that.SocketTask)
				});
				this.onMessage()
				this.SocketTask.onError(function (res) {
				  console.log('WebSocket连接打开失败，请检查！');
				});
				this.SocketTask.onClose(close => {
					console.log("close", close);
					this.socketStatus = false;
					
				});
			},
			//WebSocket连接请求数据
			LoginData(MsgType, TimeStamp, SecretKey) {
			      let data = {
			          MsgType:MsgType, //咨询者还是回答者
			          TimeStamp:TimeStamp,
			          SecretKey:SecretKey
			      }
				  // console.log(data)
				   return data;
			},
			//发送数据处理
			MsgData(MsgType, Id, Info, Pic, AddTime, Lat, Lng) {
			    var data = new Object();
				var msg =new Object()
			    data.MsgType = MsgType;
				var fixInt = function (num, n) { return (Array(n).join(0) + num).slice(-n); };
				    var newdate = function () {
				        var now = new Date();
				        var yy = now.getFullYear();      //年
				        var mm = now.getMonth() + 1;     //月
				        var dd = now.getDate();          //日
				        var hh = now.getHours();         //时
				        var ii = now.getMinutes();       //分
				        var ss = now.getSeconds();
				        return yy + "-" + fixInt(mm, 2) + "-" + fixInt(dd, 2) + " " + fixInt(hh, 2) + ":" + fixInt(ii, 2) + ":" + fixInt(ss, 2)
				    }
				if(uni.getStorageSync('name')){
					msg.name=uni.getStorageSync('name')
				}else{
					msg.name="匿名用户"
				}
				msg.Info=Info == undefined ? "" : Info
				msg.Id=Id
				msg.AddTime = AddTime == undefined ? newdate() : AddTime;
				msg=JSON.stringify(msg)
				data.Id=msg
			    data.Info = Info == undefined ? "" : Info;
			    data.Pic = Pic == undefined ? "" : Pic;
			    data.AddTime = AddTime == undefined ? newdate() : AddTime;
			    data.Lat = Lat == undefined ? 0 : Lat;
			    data.Lng = Lng == undefined ? 0 : Lng;
			    return data;
			},
			async play(){
				let res = await post('TencentCloud/PlayURL',{
					UserId: this.userId,
					Token: this.token,
					MemberId:this.ShopId
				})
				if(res.code==0){
					this.data=res.data;console.log(res.data)
					// #ifdef H5
					this.playH5()
					// #endif
				}
			},
			playH5(){
				var player = new TcPlayer('H5video', {
					"m3u8": this.data.HLS, //请替换成实际可用的播放地址
					"flv":this.data.FLV,
					"autoplay" : true,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
					"live":true,
					"controls":"none",
					"systemFullscreen":false,
					"width" :  '480',//视频的显示宽度，请尽量使用视频分辨率宽度
					"height" : this.height//视频的显示高度，请尽量使用视频分辨率高度
				});
				player.play()
			},
			//发送消息
			async sendMessage(e){
				let that=this
				let time=new Date()
				console.log(this.Id)
				this.Id=+new Date()
				let data = this.MsgData(3,this.Id,e,'',time,0,0)
				this.SocketTask.send({data:JSON.stringify(data)})
				this.onMessage()
				this.sendInfo=""
			},
			//接收消息
			onMessage(){
				let msg
				let that=this
				this.SocketTask.onMessage(r => {
					msg=JSON.parse(r.data)
					// console.log(msg,55555)
					if(msg.code==1){
						
					}else if(msg.code==3||msg.code==0){
						let obj=JSON.parse(msg.data.Id)
						console.log(obj,987)
						that.strArr.push(obj)
						for(let i=0; i<that.strArr.length; i++){
						    for(let j=i+1; j<that.strArr.length; j++){
						        if(that.strArr[i].Id==that.strArr[j].Id){ //第一个等同于第二个，splice方法删除第二个
						            that.strArr.splice(j,1);
						            j--;
						        }
						    }
						}
						console.log('arr',that.strArr)
						this.isshowInput=false;
						this.$nextTick(function(){//等最新一条消息dom更新，滚动到底部
							that.scrollTop=this.scrollTop+50
						})
					}else if(msg.code==2){//连接断开，重新连接
						// let data=that.LoginData(1,that.TimeStamp,that.SecretKey)
						// that.SocketTask.send({data:JSON.stringify(data)})
						// uni.showToast({
						// 	title:'正在重连请稍等...',
						// 	icon:'none'
						// })
					}
				})
			},
			//弹出输入框获取焦点
			Repliy(){
				this.isshowInput=true;
				this.inputFocusStatus=true;
			},
			//失去焦点
			blurFocus(){
				// this.isshowInput=false;
				this.inputFocusStatus=false;
			},
			//商品倒计时隐藏
			countTime(){
				let TIME_COUNT = 10; 
				this.countNum = TIME_COUNT;
				let timer = setInterval(() => {
					if (this.countNum > 0 && this.countNum <= TIME_COUNT) {
						this.countNum--;
						this.showgoodsbox=true;
					} else {
						clearInterval(timer);
						timer = null;
						this.showgoodsbox=false;
					}
				}, 1000);
			},
			//链接跳转
			goUrl(url){
			  uni.navigateTo({
				url:url
			  })
			},
		},
	}
</script>

<style scoped lang="scss">
	.swiper{
		height: 100vh;
		width: 100vw;
		video{
			width: 100%;
			height: 100%;
			/* #ifdef H5 */
			height: 92%;
			/* #endif */
		}
	}
	.H5video{
		width: 100%;
	}
	
	.nlv-footToolbar{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20upx;
		.nlv-rollMsgPanel{
			height: 60vh;
			.nlv-msglist{
				margin-bottom: 20upx;
				flex-direction: row;
				.msg_bg{
					flex-direction: row;
					flex-wrap: wrap;
					background: rgba(0,0,0,.4);
					border-radius: 12upx;
					padding: 10upx 20upx;
					line-height: 1.2;
					max-width:64%;
					text{
						display: inline-block;
					}
					.msg_name{ color:#f5d916;  margin-right: 10upx;}
					.msg_text{ color:#fff}
				}
				.nlv-msglist::after{
					display: block;
					content:"";
					width: 100%;}
			}
		}
		.goodsbox{
			width: 420upx;
			margin-top: 20upx;
			.item{
				display: flex;
				background: #fff;
				flex-direction: row;
				justify-content: flex-start;
				.imgbox{
					width: 100upx; height:100upx;
					margin-right: 20upx;
				}
				.txtBox{ width: 300upx;}
				.title{
					display: block;
				}
			}
		}
		.nlv-infobox{
			display: flex;
			flex-direction: row;
			margin-top: 20upx;
			.nlv_reply{
				flex-direction: row;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 80upx; width: 320upx; padding: 0 20upx; border-radius:40upx;background: rgba(0,0,0,.4); 
				.icon_bianji{
					width: 46upx;
					height: 46upx;
					margin: 0;
				}
				.nlv_reply_text{ color:#fff}
			}
			.btn-toolitem{
				height: 80upx; width: 80upx; border-radius:50%;background: rgba(0,0,0,.4); margin-right: 20upx;padding: 10upx;box-sizing: border-box;
				.icon_goods{
					width: 60upx;
					height: 60upx;
					display: block;
				}
			}
		}
	}
	.uni-modal-gooods{
		background: #fff;
		border-radius: 12upx 12upx 0 0;
		.bottom-title{
			font-size: 32upx;
			padding: 20upx;
			border-bottom:1px solid #eee;
			text-align: left;
		}
		.uni-close-btn {
			height: 60upx;
			line-height: 60upx;
			width: 60upx;
			position: absolute;
			top: 0;
			right: 0;
			font-size: 30upx;
			color: #999;
			justify-content: center;
		}
		.uni-list{
			.item{
				padding: 20upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.imgbox{
					width: 140upx;
					height: 140upx;
				}
				.txtBox{ 
					width:360upx;
					text-align: left;
				}
				.r_btn{
					background-color: #ff3333;
					color: #fff;
					width: 80px;
					height: 30px;
					text-align: center;
					line-height: 30px;
					font-size: 15px;
				}
			}
			
		}
	}
	.bottomicon {
	  background: #fff;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  padding: 20upx 0 20upx 20upx;
	  z-index:9999;
	  box-sizing: border-box;
	  .inputbtn{
		  display: flex;
		  flex-direction: row;
		  justify-content: space-between;
		  align-items: center;
		  .input_text{
			  border: 1px solid #ddd;
			  border-radius: 8upx;
			  padding: 0 20upx;
			  min-height:60upx;
			  display: block;
			  width: 100%;
			  background: #f5f5f5;
		  }
		  .rightbtn{
			  flex-direction: row;
			  .sendBtn{ 
				  display: block;
				  width: 52upx;
				  height: 52upx;
				  margin-left: 4upx;
				  padding: 0 20upx;
			  }
		  }
	  }
	}
</style>
