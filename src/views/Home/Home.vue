<template>
  <div id="main-se">
    <el-row style="padding-bottom: 15px; padding-top: 6%">
      <el-col>
        <h1>输入让你无语的长链接</h1>
      </el-col>
    </el-row>
    <el-row style="padding-bottom: 18px">
      <el-col>
        <el-input size="large" style="max-width: 70%;"
                  v-model="input" placeholder="Please input url"
                  @keyup.enter="moveToDescription">
          <template #prepend>{{http_prefix}}</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row style="padding-bottom: 18px; position: relative" justify="center" :gutter=20>
      <el-space wrap style="position:relative;">
      <el-col>
        <el-input size="large" id="descriptionInput"
                  v-model="description" placeholder="new url shorten"
                  :suffix-icon="Tickets">
          <template #prepend>Description</template>
        </el-input>
      </el-col>
      <el-col>
        <el-button-group>
          <el-button round size="large" type="primary" @click="submit" :icon="Check">
            Shorten it !
          </el-button>
          <el-button round size="large" type="primary" @click="refresh">
            Clear Data <el-icon class="el-icon--right"><Refresh /></el-icon>
          </el-button>
        </el-button-group>
      </el-col>
      </el-space>
    </el-row>
    <el-row class="result-box">
      <el-col>
        <el-card v-if="url_table.length !== 0" style="position: relative;">
          <el-table  :data="url_table" max-height="300" :default-sort="{ prop: 'time', order: 'descending' }"
                     style="text-align: center; width: 780px" stripe class="result-table">
            <el-table-column prop="time" label="Time" width="180" />
            <el-table-column prop="shorten_url" label="ShortenUrl" width="250" />
            <el-table-column prop="description" label="Description" width="200" />
            <el-table-column label="Operations" width="150">
              <template #default="scope">
                <el-button size="small"
                           type="primary"
                           @click="handleCopy(scope.row)">Copy</el-button>
                <el-button size="small"
                           type="danger"
                           @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue'
import {ElMessage} from "element-plus";
import {getShortenUrl} from '@/api'
import {getCurrentTime} from '@/utils/time'
import {getUrlPrefix} from "@/utils";
import {Check, Tickets} from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()
const http_prefix = ref('https://')
const input = ref('')
const description = ref('')
const url_table = ref([]);
const handleCopy = async (row) => {
  try {
    console.log(row.shorten_url)
    await toClipboard(row.shorten_url)
    send_success_msg("复制成功")
  } catch (e) {
    send_error_msg("复制失败")
    console.error(e)
  }
}

const handleDelete = (index, row) => {
  url_table.value = url_table.value.filter(item => item.shorten_url !== row.shorten_url)
}

const moveToDescription = async () => {
  await nextTick()
  document.getElementById('descriptionInput').focus()
}

watch(input, (val, old) => {
  if (val.startsWith("https://")) {
    http_prefix.value = "https://"
    input.value = input.value.replace("https://", "")
  }
  else if (val.startsWith("http://")) {
    http_prefix.value = "http://"
    input.value = input.value.replace("http://", "")
  }
  else {
    const url_prefix = getUrlPrefix(val)
    if (url_prefix !== null) {
      send_error_msg("仅支持http/https协议的短链生成")
    }
  }
})

function isValidLength(url) {
  return url.length <= 1023 && url.length >= 18
}

function isExist(url) {
  const url_list = url_table.value.map(item => {
    return item.original_url
  })
  return url_list.indexOf(url)
}

const send_error_msg = (msg) => {
  ElMessage({
    message: msg,
    type: 'error',
  })
}
const send_success_msg = (msg) => {
  ElMessage({
    message: msg,
    type: 'success',
  })
}
const getDescription = () => {
  if (description.value.length === 0) {
    return 'new url shorten'
  }
  return description.value
}
function submit() {
  // console.log(input.value)
  if (!isValidLength(input.value)) {
    send_error_msg("长链接长度应保证大于等于18并小于1024")
    return
  }
  if (!isUrl(http_prefix.value + input.value)) {
    send_error_msg("请输入正确长链接")
    return
  }
  if (isExist(input.value) !== -1) {
    send_error_msg("该长链接已存在缓存中")
    return;
  }
  getShortenUrl({"original_url": http_prefix.value + input.value}).then((res) => {
    send_success_msg("短链接生成成功")
    url_table.value.push({
      time: getCurrentTime(),
      shorten_url: res.shorten_url,
      original_url: input.value,
      description: getDescription()
    })
    //主页面显示最近6次的查询
    if (url_table.value.length > 6) {
      url_table.value.shift()
    }
    input.value = ''
    description.value = ''
    // console.log(res)
  })
}

function refresh() {
  if(url_table.value.length === 0) {
    send_error_msg("缓存为空，不需要清理")
    return
  }
  url_table.value = []
  send_success_msg("清理缓存完成")
}

function isUrl (url) {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
}
</script>

<style>
#main-se {
  text-align: center;
  position: relative;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
}
.result-box {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 830px;
}
.result-table {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>