<template>
	<!-- 问大家 -->
	<view class="askeveryone">
		<view class="ask-box" v-for="(val,key) in problemList" :key="key">
			<view class="ask"><span>问</span>{{val.Content}}</view>
			<view class="ask color" v-if="val.answers&&val.answers.length"><span>答</span>{{val.answers[0]}}</view>
			<view class="flex-between">
				<view class="ask-txt">{{val.AddTime}}</view>
				<view class="flex">
					<view class="ask-txt txt" @click="navigate('shopSon/product/productProblemDetail',{item:JSON.stringify(val)})">共{{val.count}}个回答</view>
					<image src="../../../static/my/icon-right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="ask-bottom" @click="problemWinStatus = true">问大家</view>
        <div class="ask-win" v-if="problemWinStatus">
            <div class="content">
                <div class="tit">提问</div>
                <textarea name="" id="" cols="30" rows="10" v-model="problemContent" placeholder="请输入要提问的问题"></textarea>
                <div class="btn-box">
                    <div class="cancel" @click="problemWinStatus = false">取消</div>
                    <div class="confirm" @click="problemConfirm">确定</div>
                </div>
            </div>
        </div>
		<uni-load-more :loadingType="loadingType" v-if="problemList.length"></uni-load-more>
		<notData v-else tipsTitle="暂无提问"></notData>
	</view>
</template>
<script>
    import {post,get,toLogin,navigate,dateUtils,toast} from '@/common/util.js';
    import uniLoadMore from '@/components/uni-load-more.vue';
	import notData from '@/components/notData.vue';
    export default {
		components: {
			uniLoadMore,notData
		},
        data(){
            return {
                navigate,
                userId: "",
                token: "",
				page:1,
				pageSize:12,
				loadingType:0,//0-loading前；1-loading中；2-没有更多了
                proId:'',
                problemList:[],
                problemWinStatus:false,
                problemContent:'',
                
            }
        },
        onLoad(e){
            e.proId &&(this.proId = e.proId);
            this.userId = uni.getStorageSync("userId");
            this.token = uni.getStorageSync("token");
            this.getProblemList();
        },
        onShow() {
            this.userId = uni.getStorageSync("userId");
            this.token = uni.getStorageSync("token");
        },
        methods:{
            async getProblemList(){
				this.loadingType =1;
				if(this.page===1){
					this.problemList=[];
				}
                const res = await post('Goods/QuestionsdList',{
                    UserId:this.userId,
                    Token:this.token,
                    ProductId:this.proId,
                    Page:this.page,
                    PageSize:this.pageSize
                })
                const data = res.data;
				// if(res.code)return;
                data.map(item=>{
                    item.AddTime = dateUtils.format(item.AddTime)
                    this.problemList.push(item);
                })
				this.loadingType = 0;
				if(data.length<this.pageSize){
					this.loadingType=2;
				}
            },
            async problemConfirm(){
                if(!this.problemContent){
                    toast('请填写提问问题！')
                    return;
                }
                const res = await post('Goods/Questionsd',{
                    UserId:this.userId,
                    Token:this.token,
                    ProductId:this.proId,
                    TypeInt:1,
                    Content:this.problemContent
                })
                toast('提问成功！',{icon:true})
                setTimeout(()=>{
                    this.problemWinStatus = false;
                    this.problemContent = '';
                    this.page=1;
                    this.getProblemList();
                },1500)
            }
        },
		// 上拉加载更多
		onReachBottom(){
			if(this.loadingType===2)return;
			this.page+=1;
			this.getProblemList()
		},
    }
</script>

<style lang="scss" scoped>
	.askeveryone{
        padding-bottom:110upx;
		.ask-box{
			margin-top: 20upx;
			background: #fff;
			padding: 30upx;
			.ask{
				padding-bottom: 20upx;
				span{
					height:26upx;
					background:rgba(222,27,110,1);
					border-radius:6upx;
					font-size:20upx;
					line-height: 26upx;
					color:rgba(255,255,255,1);
					padding: 0 6upx;
					margin-right: 10upx;
				}
			}
			.color{
				span{
					background:rgba(98,160,247,1);
				}
			}
			.ask-txt{
				font-size: 26upx;
				color: #999999;
				
			}
			.txt{
				color: #666666;
			}
			image{
				width:18upx;
				height:24upx;
				margin: 12upx 0 0 16upx;
			}
		}
		.ask-bottom{
			width: 90%;
			height:88upx;
			background:rgba(222,27,110,1);
			border-radius:44upx;
			font-size:32upx;
			color:rgba(255,255,255,1);
			line-height:88upx;
			position: fixed;
			bottom: 20upx;
			text-align: center;
			margin: 0 30upx;
		}
    }
    .ask-win{
        position:fixed;
        top:0;left:0;
        width:100%;height:100vh;
        background:rgba(0,0,0,.4);
        display:flex;
        align-items:center;
        justify-content:center;
        .content{
            background:#fff;
            border-radius:15upx;
            overflow:hidden;
            padding:0 30upx;
            .tit{
                font-weight:bold;
                font-size:30upx;
                text-align:center;
                line-height:90upx;
            }
            .btn-box{
                display:flex;
                align-items:center;
                border-top:1upx solid #e8e8e8;
                div{
                    width:50%;
                    text-align:center;
                    line-height:90upx;
                    &:last-child{
                        border-left:1px solid #e8e8e8;
                        color:$primary;
                    }
                }
            }
        }
    }
</style>
