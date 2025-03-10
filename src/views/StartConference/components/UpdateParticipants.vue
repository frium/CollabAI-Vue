<script setup>
import { getMyAuthAPI, updateParticipantsAPI } from '@/api/conference';
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchText = ref('');
const props = defineProps({
  participants: {
    type: Array,
    default: []
  }
});
const deleteUser = ref({});
const deleteAllDialogVisible = ref(false);
const toAdminDialogVisible = ref(false);
const handleAuthorizate = async (index, data) => {
  let msg = '授权成功!';
  if (props.participants[index].authType === 2) {
    props.participants[index].authType = 3;
    msg = '撤权成功!'
  } else {
    props.participants[index].authType = 2;
  }
  await updateParticipantsAPI(route.params.startConferenceId, props.participants);
  ElMessage.success(msg)
}
const toAdminUser = ref({});

const handleAdminAuth = (index, data) => {
  toAdminUser.value = data;
  toAdminUser.value.index = index;
  toAdminDialogVisible.value = true;
}

const affirmToAdmin = async () => {
  props.participants[toAdminUser.value.index].authType = 1;
  props.participants[0].authType = 2;
  await updateParticipantsAPI(route.params.startConferenceId, props.participants);
  myAuth.value = 2;
  ElMessage.success('转让成功!')
  toAdminDialogVisible.value = false;
}
const dialogVisible = ref(false);
const handleDelete = (index, data) => {
  deleteUser.value = data;
  deleteUser.value.index = index;
  dialogVisible.value = true;
}
const affirmDelete = async () => {
  props.participants.splice(deleteUser.value.index, deleteUser.value.index);
  dialogVisible.value = false;
  await updateParticipantsAPI(route.params.startConferenceId, props.participants);
  ElMessage.success('踢出成功!')
}
const selectedIndexes = ref([]);

const handleDeleteAllSelected = () => {
  deleteAllDialogVisible.value = true;
}
const affirmDeleteAll = async () => {
  for (let i = 0; i < props.participants.length; i++) {
    for (let j = 0; j < selectedIndexes.value.length; j++) {
      if (props.participants[i].userId === selectedIndexes.value[j]) props.participants.splice(i, 1);
    }
  }
  deleteAllDialogVisible.value = false;
  await updateParticipantsAPI(route.params.startConferenceId, props.participants);
  ElMessage.success('踢出成功!')

}
const handleSelectionChange = (selectedRows) => {
  selectedIndexes.value = selectedRows.map(row => row.userId);
};


const myAuth = ref(-1);
onMounted(async () => {
  const res = await getMyAuthAPI(route.params.startConferenceId);
  myAuth.value = res.data.authType;
})
</script>

<template>
  <div class="upadte-participants">
    <el-table ref="multipleTableRef" :data="props.participants" row-key="userId" style="width: 900px"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column width="65">
        <template #default="{ row }">
          <img style="width: 40px; height: 40px; border-radius: 10%;" :src="row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column property="nickname" width="120" />


      <el-table-column>
        <template #default="scope">
          <div style="display: flex; justify-content: flex-end;">
            <el-tag :type="scope.row.authType === 1
              ? 'danger'
              : scope.row.authType === 2
                ? 'warning'
                : 'info'
              " disable-transitions>
              {{
                scope.row.authType === 1
                  ? '创建者'
                  : scope.row.authType === 2
                    ? '操作者'
                    : '参与者'
              }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="myAuth === 1" width="450">
        <template #default="scope">
          <div style="margin-left: auto; width: 180px; display: flex; justify-content: flex-end;">
            <el-button size="small" type="warning" @click="handleAuthorizate(scope.$index, scope.row)"
              v-if="myAuth === 1 && scope.row.authType === 2">
              撤权
            </el-button>
            <el-button size="small" type="warning" @click="handleAuthorizate(scope.$index, scope.row)"
              v-else-if="myAuth === 1 && scope.$index !== 0">
              授权
            </el-button>
            <el-button size="small" type="warning" @click="handleAdminAuth(scope.$index, scope.row)"
              v-if="myAuth === 1 && scope.$index !== 0">
              转让
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
              v-if="myAuth === 1 && scope.$index !== 0">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="operate-menue">
      <el-input v-model="searchText" style="width: 300px" placeholder="输入昵称查询" :suffix-icon="Search" />
      <el-button style="width: 120px;" v-if="myAuth === 1" type="danger" @click="handleDeleteAllSelected">
        删除所有选择
      </el-button>
      <div v-else style="width: 120px;"></div>
    </div>
    <el-dialog v-model="dialogVisible" title="警告" width="500" :before-close="handleClose">
      <span>确认将当前用户 <span style="color: red;">{{ ' ' + deleteUser.nickname + ' ' }}</span>踢出会议?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" type="info">取消</el-button>
          <el-button type="danger" @click="affirmDelete">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteAllDialogVisible" title="警告" width="500" :before-close="handleClose">
      <span>确认将当前选择的所有用户踢出会议?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteAllDialogVisible = false" type="info">取消</el-button>
          <el-button type="danger" @click="affirmDeleteAll">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="toAdminDialogVisible" title="警告" width="500" :before-close="handleClose">
      <span>确认将当前用户<span>{{ toAdminUser.nickname }}</span>设置为创建者?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="toAdminDialogVisible = false" type="info">取消</el-button>
          <el-button type="danger" @click="affirmToAdmin">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.upadte-participants {
  position: relative;
  width: 950px;
  padding: 20px;
  border: 1px solid gray;

  .operate-menue {
    position: absolute;
    top: 18px;
    right: 38px;
    z-index: 5;
    display: flex;
    gap: 408px;
  }
}
</style>
