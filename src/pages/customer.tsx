import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import { EditTwoTone } from "@ant-design/icons";

const dataSource = [
  {
    key: "1",
    name: "BoE",
    address: "上海浦江",
    contacts_name: "BoE",
    contacts_mobile: "111111111",
    remark: "小企业",
  },
  {
    key: "2",
    name: "Fei",
    address: "上海青浦",
    contacts_name: "Fei",
    contacts_mobile: "222222222",
    remark: "跨国企业",
  },
  {
    key: "3",
    name: "Cozy",
    address: "上海泗泾",
    contacts_name: "Cozy",
    contacts_mobile: "3333333333",
    remark: "上市公司",
  },
  {
    key: "4",
    name: "Lei",
    address: "上海青浦",
    contacts_name: "Lei",
    contacts_mobile: "444444",
    remark: "大企业",
  },
];

interface Company {
  name: string;
  address?: string;
  contacts_name?: string;
  contacts_mobile?: string;
  remark?: string;
}

enum Operation {
  Add,
  Edit,
}

const Customer = () => {
  const initialValues = {
    name: "",
    address: "",
    contacts_name: "",
    contacts_mobile: "",
    remark: "",
  };
  const login = useRecoilValue(loginState);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);

  const [form] = Form.useForm();

  useEffect(() => {
    !login && router.push("/login");
  }, [login, router]);

  const handleAdd = () => {
    form.setFieldsValue(initialValues);
    setOperation(Operation.Add);
    setModalOpen(true);
  };

  const handleEditOne = (record: Company) => {
    setOperation(Operation.Edit);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    const values = form.getFieldsValue();
    console.log(values, "values");
  };

  const handleCancel = () => {
    form.resetFields();
    setModalOpen(false);
  };

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
      dataIndex: "contacts_name",
      key: "contacts_name",
    },
    {
      title: "客户联系人电话",
      dataIndex: "contacts_mobile",
      key: "contacts_mobile",
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
      <Button
        onClick={handleAdd}
        type="primary"
        style={{ marginBottom: 16, background: "#198348" }}
      >
        添加
      </Button>
      <Table bordered dataSource={dataSource} columns={columns} />
      <Modal
        destroyOnClose
        title={operation === Operation.Add ? "添加客户" : "编辑客户"}
        open={modalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout={"horizontal"}
          form={form}
          initialValues={initialValues}
          // onValuesChange={() => console.log(222222)}
          style={{ maxWidth: 600, color: "#000" }}
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
          <Form.Item label="电话" name="contacts_mobile">
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
