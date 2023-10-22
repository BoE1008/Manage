import { getProjectYSList } from "@/restApi/project";
import { useEffect, useState } from "react";
import { Form, Table, Modal, Input, Button, Space } from "antd";
import { useRouter } from "next/router";
import { EditTwoTone, PlusSquareTwoTone } from "@ant-design/icons";

const Item = () => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [data, setData] = useState();
  const [ysModalOpen, setYsModalOpen] = useState(false);
  const [yfModalOpen, setYfModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    (async () => {
      const data = await getProjectYSList(slug, 1, 10);
      console.log(data, "data");
      setData(data);
    })();
  }, [slug]);

  const expandedRowRender = () => {
    const littleTableColumn = [
      {
        title: "供应商",
        dataIndex: "supplierName",
        key: "supplierName",
      },
      {
        title: "人民币",
        dataIndex: "yfRmb",
        key: "yfRmb",
      },
      {
        title: "美金",
        dataIndex: "yfDollar",
        key: "yfDollar",
      },
      {
        title: "汇率",
        dataIndex: "yfExrate",
        key: "yfExrate",
      },
      {
        title: "对账",
        dataIndex: "yfChecking",
        key: "yfChecking",
      },
      {
        title: "开票",
        dataIndex: "yfInvoice",
        key: "yfInvoice",
      },
      {
        title: "付款",
        dataIndex: "yfCollection",
        key: "yfCollection",
      },
      {
        title: "时间",
        dataIndex: "yfDate",
        key: "yfDate",
      },
    ];

    return (
      <div>
        <Table
          dataSource={data?.entity.data[0].yf_data}
          columns={littleTableColumn}
          pagination={false}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "客户",
      dataIndex: "customName",
      key: "customName",
    },
    {
      title: "人民币",
      dataIndex: "ysRmb",
      key: "ysRmb",
    },
    {
      title: "美金",
      dataIndex: "ysDollar",
      key: "ysDollar",
    },
    {
      title: "汇率",
      dataIndex: "ysExrate",
      key: "ysExrate",
    },
    {
      title: "对账",
      dataIndex: "ysChecking",
      key: "ysChecking",
    },
    {
      title: "开票",
      dataIndex: "ysInvoice",
      key: "ysInvoice",
    },
    {
      title: "收款",
      dataIndex: "ysCollection",
      key: "ysCollection",
    },
    {
      title: "时间",
      dataIndex: "ysDate",
      key: "ysDate",
    },
    {
      title: "操作",
      key: "action",
      render: (record) => {
        return (
          <Space size="middle">
            <Button
              style={{ display: "flex", alignItems: "center" }}
              // onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setYfModalOpen(true)}
            >
              <PlusSquareTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleYsAddClick = () => {
    setYsModalOpen(true);
  };

  return (
    <div>
      <Button onClick={handleYsAddClick}>添加应收</Button>
      <Table
        bordered
        dataSource={data?.entity.data}
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
      />

      {/* 应收弹窗 */}
      <Modal
        centered
        destroyOnClose
        open={ysModalOpen}
        title="添加应收"
        // onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setYsModalOpen(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
      >
        <Form
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
        >
          <Form.Item label="客户" name="customName">
            <Input placeholder="输入客户名称" />
          </Form.Item>
          <Form.Item label="人民币" name="ysRmb">
            <Input placeholder="请输入金额" />
          </Form.Item>
          <Form.Item label="美金" name="ysDollar">
            <Input placeholder="请输入金额" />
          </Form.Item>
          <Form.Item label="汇率" name="ysExrate">
            <Input placeholder="请输入汇率" />
          </Form.Item>
          <Form.Item label="对账" name="ysChecking">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="开票" name="ysInvoice">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="收款" name="ysCollection">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="日期" name="ysDate">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 应付弹窗 */}
      <Modal
        centered
        destroyOnClose
        open={yfModalOpen}
        title="添加应付"
        // onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setYfModalOpen(false)}
        afterClose={() => form1.resetFields()}
        style={{ minWidth: "650px" }}
      >
        <Form
          form={form1}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
        >
          <Form.Item label="供应商" name="supplierName">
            <Input placeholder="输入供应商名称" />
          </Form.Item>
          <Form.Item label="人民币" name="yfRmb">
            <Input placeholder="请输入金额" />
          </Form.Item>
          <Form.Item label="美金" name="yfDollar">
            <Input placeholder="请输入金额" />
          </Form.Item>
          <Form.Item label="汇率" name="yfExrate">
            <Input placeholder="请输入汇率" />
          </Form.Item>
          <Form.Item label="对账" name="yfChecking">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="开票" name="yfInvoice">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="付款" name="yfCollection">
            <Input placeholder="是否" />
          </Form.Item>
          <Form.Item label="日期" name="yfDate">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Item;
