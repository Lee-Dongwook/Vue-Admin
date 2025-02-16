<script lang="ts" setup>
import type { TableResponseData } from "@/common/apis/tables/type";
import type { ElMessageBoxOptions } from "element-plus";
import type {
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps,
} from "vxe-table";
import { deleteTableDataApi, getTableDataApi } from "@/common/apis/tables";
import { RoleColumnSlots } from "./tsx/RoleColumnSlots";
import { StatusColumnSlots } from "./tsx/StatusColumnSlots";

defineOptions({
  name: "VxeTable",
});

interface RowMeta {
  id: number;
  username: string;
  roles: string;
  phone: string;
  email: string;
  status: boolean;
  createTime: string;
  _VXE_ID?: string;
}

const xGridDom = ref<VxeGridInstance>();
const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  pagerConfig: {
    align: "right",
  },
  formConfig: {
    items: [
      {
        field: "username",
        itemRender: {
          name: "$input",
          props: { placeholder: "username", clearable: true },
        },
      },
      {
        field: "phone",
        itemRender: {
          name: "$input",
          props: {
            placeholder: "phone",
            clearable: true,
          },
        },
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: {
                type: "submit",
                content: "submit",
                status: "primary",
              },
            },
            {
              props: {
                type: "reset",
                content: "reset",
              },
            },
          ],
        },
      },
    ],
  },
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: {
      buttons: "toolbar-btns",
    },
  },

  customConfig: {
    checkMethod: ({ column }) => !["username"].includes(column.field),
  },
  columns: [
    { type: "checkbox", width: "50px" },
    { field: "username", title: "username" },
    { field: "roles", title: "roles", slots: RoleColumnSlots },
    { field: "phone", title: "phone" },
    { field: "email", title: "email" },
    { field: "status", title: "status", slots: StatusColumnSlots },
    { field: "createTime", title: "createTime" },
    {
      title: "",
      width: "150px",
      fixed: "right",
      showOverflow: false,
      slots: { default: "row-operate" },
    },
  ],
  proxyConfig: {
    seq: true,
    form: true,
    autoLoad: true,
    props: {
      total: "total",
    },
    ajax: {
      query: ({ page, form }) => {
        xGridOpt.loading = true;
        crudStore.clearTable();
        return new Promise((resolve) => {
          let total = 0;
          let result: RowMeta[] = [];
          const callback = (res: TableResponseData) => {
            if (res?.data) {
              total = res.data.total;
              result = res.data.list;
            }
            xGridOpt.loading = false;
            resolve({ total, result });
          };
          const params = {
            username: form.username || "",
            phone: form.phone || "",
            size: page.pageSize,
            currentPage: page.currentPage,
          };
          getTableDataApi(params).then(callback).catch(callback);
        });
      },
    },
  },
});

const xModalDom = ref<VxeModalInstance>();
const xModalOpt: VxeModalProps = reactive({
  title: "",
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate();
    return Promise.resolve();
  },
});

const xFormDom = ref<VxeFormInstance>();
const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: "100px",
  loading: false,
  titleColon: false,
  data: {
    username: "",
    password: "",
  },
  items: [
    {
      field: "username",
      title: "username",
      itemRender: { name: "$input", props: { placeholder: "username" } },
    },
    {
      field: "password",
      title: "password",
      itemRender: { name: "$input", props: { placeholder: "password" } },
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          {
            props: { content: "content" },
            events: { click: () => xModalDom.value?.close() },
          },
          {
            props: {
              type: "submit",
              content: "submit",
              status: "primary",
            },
            events: {
              click: () => crudStore.onSubmitForm(),
            },
          },
        ],
        rules: {
          username: [
            {
              required: true,
              validator: ({ itemValue }: { itemValue: any }) => {
                switch (true) {
                  case !itemValue:
                    return new Error("");
                  case !itemValue.trim():
                    return new Error("");
                }
              },
            },
          ],
          password: [
            {
              required: true,
              validtor: ({ itemValue }: { itemValue: any }) => {
                switch (true) {
                  case !itemValue:
                    return new Error("");
                  case !itemValue.trim():
                    return new Error("");
                }
              },
            },
          ],
        },
      },
    },
  ],
});

const crudStore = reactive({
  isUpdate: true,
  commitQuery: () => xGridDom.value?.commitProxy("query"),
  clearTable: () => xGridDom.value?.reloadData([]),
  onShowModal: (row?: RowMeta) => {
    if (row) {
      crudStore.isUpdate = true;
      xModalOpt.title = "title";
      xFormOpt.data.username = row.username;
    } else {
      crudStore.isUpdate = false;
      xModalOpt.title = "title";
    }
    const props = xFormOpt.items?.[0]?.itemRender?.props;
    props && (props.disabled = crudStore.isUpdate);
    xModalDom.value?.open();
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset();
      xFormDom.value?.clearValidate();
    });
  },
  onSubmitForm: () => {
    if (xFormOpt.loading) return;
    xFormDom.value?.validate((errMap) => {
      if (errMap) return;
      xFormOpt.loading = true;
      const callback = () => {
        xFormOpt.loading = false;
        xModalDom.value?.close();
        ElMessage.success("success");
        !crudStore.isUpdate && crudStore.afterInsert();
        crudStore.commitQuery();
      };
      if (crudStore.isUpdate) {
        setTimeout(() => callback(), 1000);
      } else {
        setTimeout(() => callback(), 1000);
      }
    });
  },
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager;
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize;
      if (currentTotal === pager.total) {
        ++pager.currentPage;
      }
    }
  },
  onDelete: (row: RowMeta) => {
    const tip = ``;
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "cancel",
      confirmButtonText: "confirm",
      dangerouslyUseHTMLString: true,
    };
    ElMessageBox.confirm(tip, "", config).then(() => {
      deleteTableDataApi(row.id).then(() => {
        ElMessage.success("success");
        crudStore.afterDelete();
        crudStore.commitQuery();
      });
    });
  },
  afterDelete: () => {
    const tableData: RowMeta[] = xGridDom.value!.getData();
    const pager = xGridDom.value?.getProxyInfo()?.pager;
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage;
    }
  },
  moreFn: () => {},
});
</script>

<template>
  <div class="app-container">
    <el-alert title="title" type="success" description="" show-icon />
    <vxe-grid ref="xGridDom" v-bind="xGridOpt">
      <template #toolbar-btns>
        <vxe-button
          status="primary"
          icon="vxe-icon-add"
          @click="crudStore.onShowModal()"
        >
        </vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete"></vxe-button>
      </template>
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">
        </el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">
        </el-button>
      </template>
    </vxe-grid>
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
</style>
