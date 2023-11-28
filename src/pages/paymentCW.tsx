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
} from "antd";
import { Operation } from "@/types";
import dayjs from "dayjs";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { getPaymentCWList, addPayment, updatePayment } from "@/restApi/payment";
import { getProjectsSubmitList } from "@/restApi/project";
import { getSuppliersList } from "@/restApi/supplyer";

const Role = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [project, setProject] = useState();
  const [supplier, setSupplier] = useState();


  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getPaymentCWList(page, pageSize);
      const projectData = await getProjectsSubmitList(1, 10000);
      const supplierData = await getSuppliersList(1, 10000);
      setData(res);
      setSupplier(supplierData.entity.data);
      setProject(
        projectData.entity.data.filter((item) => item.state === "审批通过")
      );
    })();
  }, [page, pageSize]);

  const handleAdd = async () => {
    setOperation(Operation.Add);
    setModalOpen(true);
  };

  const handleEditOne = (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    const { code } =
      operation === Operation.Add
        ? await addPayment(values)
        : await updatePayment(editId, values);
    if (code === 200) {
      setModalOpen(false);
      const data = await getPaymentCWList(page, pageSize);
      setLoading(false);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteOne = async (id: string) => {
    await deleteCustomer(id);
    const data = await getPaymentCWList(page, pageSize);
    setLoading(false);
    setData(data);
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
      title: "供应商",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "金额",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "币种",
      dataIndex: "moneyType",
      key: "moneyType",
    },
    {
      title: "审核状态",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "税号",
      dataIndex: "taxationNumber",
      key: "taxationNumber",
    },
    {
      title: "银行卡号",
      dataIndex: "bankCard",
      key: "bankCard",
    },
    {
      title: "开户行",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "申请人",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "应付日期",
      dataIndex: "yfDate",
      key: "yfDate",
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
              style={{ display: "flex", alignItems: "center" ,padding: "3px 5px"}}
              onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px" }}
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
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginBottom: 16, background: "#198348", width: "100px" }}
          >
            添加
          </Button>
        </Space>

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
        title={operation === Operation.Add ? "添加申请" : "编辑申请"}
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
              placeholder="选择项目"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={project?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="供应商"
            name="supplierName"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              showSearch
              placeholder="选择供应商"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={supplier?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
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
          <Form.Item
            label="应付日期"
            name="yfDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Role;
