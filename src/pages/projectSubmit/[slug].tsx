import {
  getProjectYSList,
  addProjectYS,
  updateProjectYS,
  addProjectYf,
  updateProjectYf,
} from "@/restApi/project";
import { useEffect, useState } from "react";
import {
  Form,
  Table,
  Modal,
  Input,
  Button,
  Space,
  Select,
  InputNumber,
  DatePicker,
  notification
} from "antd";
import { useRouter } from "next/router";
import { EditTwoTone, PlusSquareTwoTone } from "@ant-design/icons";
import { Operation } from "@/types";
import { getCustomersList } from "@/restApi/customer";
import { getSuppliersList } from "@/restApi/supplyer";
import dayjs from "dayjs";

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

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [customer, setCustomer] = useState();
  const [suppliers, setSuppliers] = useState();

  useEffect(() => {
    (async () => {
      const data = await getProjectYSList(slug as string, page, pageSize);
      const customerData = await getCustomersList(1, 10000);
      const supplierData = await getSuppliersList(1, 10000);
      setLoading(false);
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
      setCustomer(customerData.entity.data);
      setSuppliers(supplierData.entity.data);
    })();
  }, [slug, page, pageSize]);

  const handleYfAddClick = (record) => {
    setYsEditId(record.id);
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
    console.log(values, "values");

    const { code } =
      operation === Operation.Add
        ? await addProjectYf({ ...values, projectId: slug, ysId: ysEditId })
        : await updateProjectYf(yfEditId, values);

    if (code === 200) {
      setYfModalOpen(false);
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
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
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
        key: "yfInvoice",
        title: "开票",
        dataIndex: "yfInvoice",
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
        title: "备注",
        dataIndex: "remark",
        key: "remark",
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
          loading={loading}
          dataSource={record.yf_data.map((item, index) => ({
            ...item,
            key: index,
          }))}
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
              style={{ display: "flex", alignItems: "center",padding: "3px 5px" }}
              onClick={() => handleEditYsOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{ display: "flex", alignItems: "center",padding: "3px 5px" }}
              onClick={() => handleYfAddClick(record)}
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
    const params = {
      ...values,
      ysDate: dayjs(values.ysDate).format('YYYY-MM-DD')
    }
    const { code } =
      operation === Operation.Add
        ? await addProjectYS({ ...params, projectId: slug })
        : await updateProjectYS(ysEditId, params);

    if (code === 200) {
      setYsModalOpen(false);
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
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const customerFilterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSupplierSelectChange = (value) => {
    console.log(value, "change");
  };

  const handleSupplierSelectSearch = (value) => {
    console.log(value, "search");
  };

  const supplierFilterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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
        loading={loading}
        dataSource={data?.entity?.data}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          defaultExpandedRowKeys: ["0"],
          expandRowByClick: true,
        }}
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
          <Form.Item
            label="客户"
            name="customId"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              showSearch
              placeholder="选择客户"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={customer?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item label="人民币" name="ysRmb">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="美金" name="ysDollar">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="汇率" name="ysExrate">
            <InputNumber placeholder="请输入汇率" style={{ width: "100%" }} />
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
          <Form.Item label="日期" name="ysDate" getValueProps={(i) => ({ value: dayjs(i) })}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>

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
          <Form.Item
            label="供应商"
            name="supplierId"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              showSearch
              placeholder="选择供应商"
              optionFilterProp="children"
              onChange={handleSupplierSelectChange}
              onSearch={handleSupplierSelectSearch}
              filterOption={supplierFilterOption}
              options={suppliers?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item label="人民币" name="yfRmb">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="美金" name="yfDollar">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="汇率" name="yfExRate">
            <InputNumber placeholder="请输入汇率" style={{ width: "100%" }} />
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
          <Form.Item label="日期" name="yfDate" getValueProps={(i) => ({ value: dayjs(i) })} >
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Item;
