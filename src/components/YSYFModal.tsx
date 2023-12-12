import {
  getProjectYSList,
  addProjectYS,
  updateProjectYS,
  addProjectYf,
  updateProjectYf,
  getProjectsSubmitList,
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
  notification,
} from "antd";
import { useRouter } from "next/router";
import { EditTwoTone, PlusSquareTwoTone } from "@ant-design/icons";
import { Operation } from "@/types";
import { getCustomersList } from "@/restApi/customer";
import { getSuppliersList } from "@/restApi/supplyer";
import dayjs from "dayjs";
import { BooltypeArr } from "@/utils/const";

const Item = ({ projectId, onClose }) => {
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
      const data = await getProjectYSList(projectId as string, page, pageSize);
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
  }, [projectId, page, pageSize]);

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
    const params = {
      ...values,
      yfDate: dayjs(values.yfDate).format("YYYY-MM-DD"),
      yfChecking: values.yfChecking?.value || "x",
      isPay: values.isPay?.value || "x",
      yfCollection: values.yfCollection?.value || "x",
      yfInvoice: values.yfInvoice?.value || "x",
    };

    const { code } =
      operation === Operation.Add
        ? await addProjectYf({ ...params, projectId, ysId: ysEditId })
        : await updateProjectYf(yfEditId, params);

    if (code === 200) {
      setYfModalOpen(false);
      const data = await getProjectYSList(projectId as string, page, pageSize);
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
        title: "明细",
        dataIndex: "yfPurpose",
        key: "yfPurpose",
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
        key: "yfInvoice",
        title: "开票",
        dataIndex: "yfInvoice",
      },
      {
        title: "预留利润名称",
        dataIndex: "ylProfitName",
        key: "ylProfitName",
      },
      {
        title: "预留利润金额",
        dataIndex: "ylProfitMoney",
        key: "ylProfitMoney",
      },
      {
        title: "是否支付",
        dataIndex: "isPay",
        key: "isPay",
      },
      {
        title: "付款",
        dataIndex: "yfCollection",
        key: "yfCollection",
      },
      // {
      //   title: "时间",
      //   dataIndex: "yfDate",
      //   key: "yfDate",
      // },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "操作",
        key: "operation",
        render: (_, record) => {
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
      title: "明细",
      dataIndex: "ysPurpose",
      key: "ysPurpose",
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
    // {
    //   title: "时间",
    //   dataIndex: "ysDate",
    //   key: "ysDate",
    // },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
              onClick={() => handleEditYsOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
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
      ysDate: dayjs(values.ysDate).format("YYYY-MM-DD"),
      ysChecking: values.ysChecking?.value || "x",
      ysCollection: values.ysCollection?.value || "x",
      ysInvoice: values.ysInvoice?.value || "x",
    };
    const { code } =
      operation === Operation.Add
        ? await addProjectYS({ ...params, projectId: projectId })
        : await updateProjectYS(ysEditId, params);

    if (code === 200) {
      setYsModalOpen(false);
      const data = await getProjectYSList(projectId as string, page, pageSize);
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

  const handleSupplierSelectChange = (value) => {};

  const handleSupplierSelectSearch = (value) => {};

  const supplierFilterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      open={!!projectId}
      onCancel={onClose}
      centered
      footer={null}
      destroyOnClose
      title="应收应付列表"
      style={{ minWidth: "650px" }}
      className="!w-max"
    >
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
          <Form.Item label="明细" name="ysPurpose">
            <Input.TextArea placeholder="明细" maxLength={50} />
          </Form.Item>
          <Form.Item label="对账" name="ysChecking">
            <Select
              labelInValue
              placeholder="是否对账"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="开票" name="ysInvoice">
            <Select
              labelInValue
              placeholder="是否开票"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="收款" name="ysCollection">
            <Select
              labelInValue
              placeholder="是否收款"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          {/* <Form.Item
            label="日期"
            name="ysDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker allowClear={false} />
          </Form.Item> */}
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={50} />
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
            labelCol={{ span: 5 }}
            name="supplierId"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
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
          <Form.Item label="人民币" labelCol={{ span: 5 }} name="yfRmb">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="美金" labelCol={{ span: 5 }} name="yfDollar">
            <InputNumber placeholder="请输入金额" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="汇率" labelCol={{ span: 5 }} name="yfExrate">
            <InputNumber placeholder="请输入汇率" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="对账" labelCol={{ span: 5 }} name="yfChecking">
            <Select
              labelInValue
              placeholder="是否对账"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="开票" labelCol={{ span: 5 }} name="yfInvoice">
            <Select
              labelInValue
              placeholder="是否开票"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="付款" labelCol={{ span: 5 }} name="yfCollection">
            <Select
              labelInValue
              placeholder="是否付款"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item
            label="预留利润名称"
            labelCol={{ span: 5 }}
            name="ylProfitName"
          >
            <Input placeholder="预留利润名称" />
          </Form.Item>
          <Form.Item
            label="预留利润金额"
            labelCol={{ span: 5 }}
            name="ylProfitMoney"
          >
            <Input placeholder="预留利润金额" />
          </Form.Item>
          <Form.Item label="是否支付" labelCol={{ span: 5 }} name="isPay">
            <Select
              labelInValue
              placeholder="是否支付"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={BooltypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>
          {/* <Form.Item
            label="日期"
            labelCol={{ span: 5 }}
            name="yfDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker allowClear={false} />
          </Form.Item> */}
          <Form.Item label="备注" labelCol={{ span: 5 }} name="remark">
            <Input.TextArea placeholder="备注" maxLength={50} />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default Item;
