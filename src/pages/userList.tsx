import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, notification } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import { getUserList, updateUser, addUser } from "@/restApi/user";
import { Company, Operation } from "@/types";
import { useRouter } from "next/router";

const initialValues = {
  name: "",
  address: "",
  contactsName: "",
  contactsMobile: "",
  remark: "",
};

const User = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      if (!!sessionStorage.getItem("username")) {
        const data = await getUserList(page, pageSize, searchValue);
        setLoading(false);
        setData(data);
      } else {
        router.push("/login");
      }
    })();
  }, [page, pageSize, searchValue, router]);

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
    setLoading(true);
    const { code } =
      operation === Operation.Add
        ? await addUser(values)
        : await updateUser(values, editId);
    if (code === 200) {
      setModalOpen(false);
      const data = await getUserList(page, pageSize, searchValue);
      setLoading(false);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "登录名",
      dataIndex: "loginName",
      key: "loginName",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "联系电话",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "操作",
      key: "action",
      render: (record: Company) => {
        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
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
      <div className="flex flex-row justify-between gap-y-3">
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16, background: "#198348", width: "100px" }}
        >
          添加
        </Button>
        <Space>
          <Input
            placeholder="用户名"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {/* <Button onClick={handleSearch}>查询</Button> */}
        </Space>
      </div>
      <Table
        bordered
        loading={loading}
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
        title={operation === Operation.Add ? "添加用户" : "编辑用户"}
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
          <Form.Item required label="用户名" name="userName">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          {operation === Operation.Add && (
            <Form.Item label="登录名" name="loginName">
              <Input placeholder="请输入登录名" />
            </Form.Item>
          )}
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item label="电话" name="mobile">
            <Input placeholder="请输入电话" />
          </Form.Item>
          {/* <Form.Item label="备注" name="remark">
            <Input placeholder="备注信息" />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default User;
