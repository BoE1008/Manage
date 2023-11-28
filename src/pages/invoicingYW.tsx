import {
  getinvoicingYWList,
  addInvoicing,
  updateInvoicing,
  submitToCw,
  rejectOne,
  logsOne,
} from "@/restApi/invoicing";
import { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  notification,
  message,
  List,
  Avatar,
} from "antd";
import { Operation } from "@/types";
import dayjs from "dayjs";
import { getProjectsSubmitList } from "@/restApi/project";
import {
  EditTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  CalendarTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import {getCustomersYSList} from '@/restApi/customer'

const InvoicingSubmit = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [customer, setCustomer] = useState();
  const [project, setProject] = useState();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [logs, setLogs] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getinvoicingYWList(page, pageSize);
      const projectData = await getProjectsSubmitList(1, 10000);
      setData(res);
      setProject(
        projectData.entity.data.filter((item) => item.state === "审批通过")
      );
    })();
  }, [page,pageSize]);

  const handleEditOne = (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleLogsOne = async (id: string) => {
    const res = await logsOne(id);
    setLogs(res.entity.data);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const params = {
      ...values,
      projectId: values.projectName.value,
      projectName: values.projectName.label,
      customId: values.customName.value,
      customName: values.customName.label,
    }
    setLoading(true);
    const { code } = await updateInvoicing(editId, params);
    if (code === 200) {
      setModalOpen(false);
      const data = await getinvoicingYWList(page, pageSize);
      setLoading(false);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteOne = async (id: string) => {
    
  };

  const handleProjectChanged = async(param) => {
    const projectCustom = await getCustomersYSList(param.value)
    setCustomer(projectCustom.entity.data)

    console.log(projectCustom)
  }

  const handleSubmitToCW = async (id: string) => {
    await submitToCw(id);
    const res = await getinvoicingYWList(page, pageSize);
    setData(res);
    notification.success({ message: "提交成功" });
  };

  const validateName = () => {
    return {
      validator: (_, value) => {
        if (value.trim() !== "") {
          return Promise.resolve();
        }
        return Promise.reject(new Error("请输入客户名称"));
      },
    };
  };

  const customerFilterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const columns = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "客戶名称",
      dataIndex: "customName",
      key: "customName",
    },
    {
      title: "开票票种",
      dataIndex: "invoicingType",
      key: "invoicingType",
    },
    {
      title: "开票内容",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "开票币种",
      dataIndex: "moneyType",
      key: "moneyType",
    },
    {
      title: "开票金额",
      dataIndex: "fee",
      key: "fee",
    },

    {
      title: "税号",
      dataIndex: "taxationNumber",
      key: "taxationNumber",
    },
    {
      title: "开户行",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "卡号",
      dataIndex: "bankCard",
      key: "bankCard",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "申请人",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "申请时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "审核状态",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (record) => {
        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px", }}
              onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px", }}
              onClick={() => handleSubmitToCW(record.id)}
            >
              <CheckCircleTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px", }}
              onClick={() => handleLogsOne(record.id)}
            >
              <CalendarTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px", }}
              onClick={() => handleDeleteOne(record.id)}
            >
              <DeleteTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-2">
      <div className="flex flex-row gap-y-3 justify-between">
        <Space>
          <Input
            placeholder="名称"
            // value={searchValue}
            // onChange={(e) => setSearchValue(e.target.value)}
          />
        </Space>
      </div>
      <Table
        bordered
        // loading={loading}
        dataSource={data?.entity.data}
        columns={columns}
        pagination={{
          // 设置总条数
          total: data?.entity.total,
          // 显示总条数
          showTotal: (total) => `共 ${total} 条`,
          // 是否可以改变 pageSize
          showSizeChanger: true,

          // 改变页码时
          onChange: async (page) => {
            setPage(page);
          },
          // pageSize 变化的回调
          onShowSizeChange: async (page, size) => {
            setPage(page);
            setPageSize(size);
          },
        }}
      />

      <Modal
        centered
        destroyOnClose
        title={"编辑申请"}
        open={modalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setModalOpen(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
          form={form}
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item
            label="项目"
            name="projectName"
            rules={[{ required: true, message: "项目名称不能为空" }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder="选择项目"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={project?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
              onChange={handleProjectChanged}
            />
          </Form.Item>
          <Form.Item
            label="客户"
            name="customName"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder="选择客户"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={customer?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item required label="票种" name="invoicingType">
            <Input placeholder="票种" />
          </Form.Item>
          <Form.Item required label="内容" name="content">
            <Input placeholder="内容" />
          </Form.Item>
          <Form.Item required label="币种" name="moneyType">
            <Input placeholder="币种" />
          </Form.Item>
          <Form.Item required label="金额" name="fee">
            <Input placeholder="金额" />
          </Form.Item>
          <Form.Item label="税号" name="taxationNumber">
            <Input placeholder="税号" />
          </Form.Item>
          <Form.Item label="开户行" name="bank">
            <Input placeholder="开户行" />
          </Form.Item>
          <Form.Item label="卡号" name="bankCard">
            <Input placeholder="卡号" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="地址" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="联系电话" />
          </Form.Item>
          <Form.Item required label="申请人" name="createBy">
            <Input placeholder="申请人" />
          </Form.Item>
          <Form.Item
            label="申请时间"
            name="projectDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        destroyOnClose
        footer={null}
        title={"审核日志"}
        open={!!logs}
        style={{ minWidth: "650px" }}
        onCancel={() => setLogs(undefined)}
      >
        <List
          pagination={{ position: "bottom", align: "end" }}
          dataSource={logs}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={item.state}
                description={`${item.userName} ${item.createTime} 备注：${
                  item.remark || ""
                } `}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default InvoicingSubmit;
