<template>
  <div :index="index" class="vx-order">
    <div class="vx-order-info">
      <ul>
        <li>订单号：{{buyInfo.orderSn}}</li>
        <li>是否团购：{{buyInfo.isGroupin?'是':'否'}}</li>
        <li>订单状态：{{buyInfo.orderStatusText}}</li>
        <li>订单金额：￥{{buyInfo.actualPrice}}</li>
      </ul>
    </div>
    <div class="vx-order-goods">
      <el-table :data="buyInfo.goodsList" style="width: 100%">
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
        <el-table-column prop="picUrl" label="预览图" min-width="180" align="center">
          <template scope="scope">
            <div aria-label="点击查看大图" class="vx-order-preview btn-tip">
              <el-image
                ref="previewImg"
                fit="contain"
                class="vx-order-preview-image"
                :src="scope.row.picUrl"
                :preview-src-list="[scope.row.picUrl]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="标题" min-width="120" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" min-width="80" align="center"></el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template scope="scope">
            <a @click="desgin(scope.row.goodId)" class="vx-order-tab-link">去编辑</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vx-userBuy',
  props: {
    buyInfo: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    desgin(goodId) {
      const { href } = this.$router.resolve({
        path: '/design/' + goodId
      })
      window.open(href, '_blank')
    }
  }
}
</script>