import {
  getProjectYSList,
  addProjectYS,
  updateProjectYS,
  addProjectYf,
  updateProjectYf,
} from "@/restApi/project";
import { useEffect, useState } from "react";
import { Form, Table, Modal, Input, Button, Space } from "antd";
import { useRouter } from "next/router";
import { EditTwoTone, PlusSquareTwoTone } from "@ant-design/icons";
import { Operation } from "@/types";

const initialYSValues = {
  customName: "",
  ysRmb: "",
  ysDollar: "",
  ysExrate: "",
  ysChecking: "",
  ysInvoice: "",
  ysCollection: "",
  ysDate: "",
};

const Item = () => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [data, setData] = useState();
  const [ysModalOpen, setYsModalOpen] = useState(false);
  const [yfModalOpen, setYfModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [ysEditId, setYsEditId] = useState("");
  const [yfEditId, setYfEditId] = useState("");

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    (async () => {
      const data = await getProjectYSList(slug as string, page, pageSize);
      setData({
        ...data,
        entity: {
          ...data.entity,
          data: data.entity.data.map((item, index) => ({
            key: index,
            ...item,
          })),
        },
      });
    })();
  }, [slug, page, pageSize]);

  const handleYfAddClick = () => {
    setOperation(Operation.Add);
    setYfModalOpen(true);
  };

  const handleEditYfOne = async (record) => {
    setOperation(Operation.Edit);
    setYfEditId(record.id);
    form1.setFieldsValue(record);
    setYfModalOpen(true);
  };

  const handleYfOk = async () => {
    form1.validateFields();
    const values = form1.getFieldsValue();
    const { status } =
      operation === Operation.Add
        ? await addProjectYf(values)
        : await updateProjectYf(yfEditId, values);

    if (status === "SUCCESS") {
      setYfModalOpen(false);
      const data = await getProjectYSList(slug as string, page, pageSize);
      setData(data);
    }
  };

  const expandedRowRender = (record) => {
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
        dataIndex: "yfExRate",
        key: "yfExRate",
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
      {
        title: "操作",
        key: "operation",
        render: (record) => {
          return (
            <Button
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => handleEditYfOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          bordered
          dataSource={record.yf_data}
          columns={littleTableColumn}
          pagination={false}
        />
        {/* 应付弹窗 */}
        <Modal
          centered
          destroyOnClose
          open={yfModalOpen}
          title={operation === Operation.Add ? "添加应付" : "编辑应付"}
          onOk={handleYfOk}
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
            <Form.Item label="汇率" name="yfExRate">
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
              onClick={() => handleEditYsOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center" }}
              onClick={handleYfAddClick}
            >
              <PlusSquareTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleYsAddClick = () => {
    setOperation(Operation.Add);
    setYsModalOpen(true);
  };

  const handleEditYsOne = async (record) => {
    setOperation(Operation.Edit);
    setYsEditId(record.id);
    form.setFieldsValue(record);
    setYsModalOpen(true);
  };

  const handleYsOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const { status } =
      operation === Operation.Add
        ? await addProjectYS(values)
        : await updateProjectYS(ysEditId, values);

    if (status === "SUCCESS") {
      setYsModalOpen(false);
      const data = await getProjectYSList(slug as string, page, pageSize);
      setData(data);
    }
  };

  return (
    <div>
      <Button
        onClick={handleYsAddClick}
        type="primary"
        style={{
          marginBottom: 16,
          marginTop: 16,
          background: "#198348",
          width: "100px",
        }}
      >
        添加应收
      </Button>

      <Table
        bordered
        dataSource={data?.entity?.data}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          defaultExpandedRowKeys: ["0"],
        }}
      />

      {/* 应收弹窗 */}
      <Modal
        centered
        destroyOnClose
        open={ysModalOpen}
        title={operation === Operation.Add ? "添加应收" : "编辑应收"}
        onOk={handleYsOk}
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
    </div>
  );
};

export default Item;
