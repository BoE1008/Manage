import { useRecoilValue } from "recoil";
import { loginState } from "@/store/loginState";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Button, Modal, Form, Input } from "antd";

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

const columns = [
  {
    title: "供应商名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "供应商地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "供应商联系人",
    dataIndex: "contacts_name",
    key: "contacts_name",
  },
  {
    title: "供应商联系人电话",
    dataIndex: "contacts_mobile",
    key: "contacts_mobile",
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
];

const Supplyer = () => {
  const login = useRecoilValue(loginState);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    !login && router.push("/login");
  }, [login, router]);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleOk = async () => {
    console.log("提交");
  };

  const handleCancel = () => {
    form.resetFields();
    setModalOpen(false);
  };

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
        title={"添加供应商"}
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
          onValuesChange={() => console.log(222222)}
          style={{ maxWidth: 1000, color: "#000" }}
        >
          <Form.Item required label="名称">
            <Input placeholder="请输入供应商名称" />
          </Form.Item>
          <Form.Item label="地址">
            <Input placeholder="请输入供应商地址" />
          </Form.Item>
          <Form.Item required label="联系人">
            <Input placeholder="请输入供应商联系人姓名" />
          </Form.Item>
          <Form.Item required label="电话">
            <Input placeholder="请输入供应商联系人电话" />
          </Form.Item>
          <Form.Item label="备注">
            <Input placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplyer;
