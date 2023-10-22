import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Empty } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import {
  getCustomersList,
  addCustomer,
  updateCustomer,
} from "@/restApi/customer";
import { Company, Operation } from "@/types";

const initialValues = {
  name: "",
  address: "",
  contactsName: "",
  contactsMobile: "",
  remark: "",
};

const Customer = () => {

  const [data, setData] = useState();
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);

  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const data = await getCustomersList(page, pageSize, searchValue);
      setData(data);
    })();
  }, [page, pageSize, searchValue]);

  const handleAdd = async () => {
    form.setFieldsValue(initialValues);
    setOperation(Operation.Add);
    setModalOpen(true);
  };

  const handleEditOne = (record: Company) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const { status } =
      operation === Operation.Add
        ? await addCustomer(values)
        : await updateCustomer(editId, values);
    if (status === "SUCCESS") {
      setModalOpen(false);
      const data = await getCustomersList(page, pageSize, searchValue);
      setData(data)
    }
  };

  // const handleSearch = async () => {
  //   const data = await getCustomersList(page, pageSize, searchValue);
  //   setData(data);
  // };

  const columns = [
    {
      title: "客户名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "客户地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "客户联系人",
      dataIndex: "contactsName",
      key: "contactsName",
    },
    {
      title: "客户联系人电话",
      dataIndex: "contactsMobile",
      key: "contactsMobile",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (record: Company) => {
        return (
          <Space size="middle">
            <Button
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="w-full p-2" style={{ color: "#000" }}>
      <div className="flex flex-col gap-y-3">
        <Space>
          <Input
            placeholder="名称"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* <Button onClick={handleSearch}>查询</Button> */}
        </Space>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16, background: "#198348", width: "100px" }}
        >
          添加
        </Button>
      </div>

      {data?.entity?.data.length ? (
        <Table
          bordered
          dataSource={data?.entity.data}
          columns={columns}
          pagination={{
            // 设置总条数
            total: data.entity.total,
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
      ) : (
        <Empty style={{ marginTop: "150px" }} />
      )}
      <Modal
        centered
        destroyOnClose
        title={operation === Operation.Add ? "添加客户" : "编辑客户"}
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
          initialValues={initialValues}
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item required label="名称" name="name">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入客户地址" />
          </Form.Item>
          <Form.Item label="联系人" name="contacts_name">
            <Input placeholder="请输入客户联系人姓名" />
          </Form.Item>
          <Form.Item label="电话" name="contactsMobile">
            <Input placeholder="请输入客户联系人电话" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
