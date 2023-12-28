import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  notification,
  Tooltip,
  Select,
} from "antd";
import { EditTwoTone, DeleteTwoTone, ProfileTwoTone } from "@ant-design/icons";
import {
  getCustomersList,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/restApi/customer";
import { Company, Operation } from "@/types";
import { useRouter } from "next/router";
import {
  addCustomBank,
  getCustomBankList,
  updateCustomBank,
  deleteBank,
} from "@/restApi/account";
import { getDictByCode } from "@/restApi/dict";

const initialValues = {
  name: "",
  address: "",
  contactsName: "",
  contactsMobile: "",
  remark: "",
};

const Customer = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [loading, setLoading] = useState(true);

  const [customId, setCustomId] = useState();
  const [bankData, setBankData] = useState();

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    (async () => {
      if (!!sessionStorage.getItem("username")) {
        const data = await getCustomersList(page, pageSize, searchValue);
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
    const { code } =
      operation === Operation.Add
        ? await addCustomer(values)
        : await updateCustomer(editId, values);
    if (code === 200) {
      setModalOpen(false);
      const data = await getCustomersList(page, pageSize, searchValue);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteOne = async (id: string) => {
    await deleteCustomer(id);
    const data = await getCustomersList(page, pageSize, searchValue);
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

  const [bankOperation, setBankOperation] = useState<Operation>();
  const [bankModalState, setBankModalState] = useState<boolean>(false);
  const [moneyTypes, setMoneyTypes] = useState();
  const [bankId, setBankId] = useState();

  const handleCheckBank = async (id) => {
    const data = await getCustomBankList(id);
    setBankData(data);
    setCustomId(id);
  };

  const handleAddBank = async () => {
    setBankModalState(true);
    setBankOperation(Operation.Add);
    const res = await getDictByCode("sys_money_type");
    setMoneyTypes(res.entity);
  };

  const handleEditBank = async (record) => {
    const res = await getDictByCode("sys_money_type");
    setMoneyTypes(res.entity);
    setBankModalState(true);
    setBankOperation(Operation.Edit);
    form1.setFieldsValue(record);
    setBankId(record.id);
  };

  const handleBankOk = async () => {
    form1.validateFields();
    const values = form1.getFieldsValue();
    const params = {
      ...values,
      moneyType: values.moneyType.label,
      moneyTypeId: values.moneyType.value,
    };
    const { code } =
      bankOperation === Operation.Add
        ? await addCustomBank(customId, params)
        : await updateCustomBank(customId, bankId, params);
    if (code === 200) {
      form1.resetFields();
      setBankModalState(false);
      const res = await getCustomBankList(customId);
      setBankData(res);
      notification.success({
        message: bankOperation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteBank = async (id) => {
    await deleteBank(id);
    const res = await getCustomBankList(customId);
    setBankData(res);
    notification.success({
      message: "删除成功",
      duration: 3,
    });
  };

  const columns = [
    {
      title: "客户名称",
      dataIndex: "name",
      align: "center",
      key: "name",
    },
    {
      title: "客户地址",
      dataIndex: "address",
      align: "center",
      key: "address",
    },
    {
      title: "客户联系人",
      dataIndex: "contactsName",
      align: "center",
      key: "contactsName",
    },
    {
      title: "客户联系人电话",
      align: "center",
      dataIndex: "contactsMobile",
      key: "contactsMobile",
    },
    {
      title: "税号",
      dataIndex: "taxationNumber",
      align: "center",
      key: "taxationNumber",
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: "center",
      key: "remark",
    },
    {
      title: "操作",
      align: "center",
      key: "action",
      render: (_, record: Company) => {
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
            <Tooltip title={<span>查看银行账户信息</span>}>
              <Button
                onClick={() => handleCheckBank(record.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "3px 5px",
                }}
              >
                <ProfileTwoTone twoToneColor="#198348" />
              </Button>
            </Tooltip>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
              onClick={() => handleDeleteOne(record.id)}
            >
              <DeleteTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  const bankColumns = [
    {
      title: "银行账户",
      dataIndex: "bankCard",
      align: "center",
      key: "bankCard",
    },
    {
      title: "开户银行",
      dataIndex: "bank",
      align: "center",
      key: "bank",
    },
    {
      title: "币种",
      dataIndex: "moneyType",
      align: "center",
      key: "moneyType",
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: "center",
      key: "remark",
    },
    {
      title: "操作",
      align: "center",
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
              onClick={() => handleEditBank(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
              onClick={() => handleDeleteBank(record.id)}
            >
              <DeleteTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="w-full p-2" style={{ color: "#000" }}>
      <div className="flex flex-row gap-y-3 justify-between">
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16, background: "#198348", width: "100px" }}
        >
          添加
        </Button>
        <Space>
          <Input
            placeholder="名称"
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
        scroll={{ scrollToFirstRowOnChange: true, y: "800px" }}
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
        title={operation === Operation.Add ? "添加客户" : "编辑客户"}
        open={modalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setModalOpen(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
        maskClosable={false}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
          form={form}
          initialValues={initialValues}
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item
            required
            label="名称"
            name="name"
            rules={[validateName]}
            validateTrigger="onBlur"
            hasFeedback
          >
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
          <Form.Item label="税号" name="taxationNumber">
            <Input placeholder="请输入税号" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注信息" maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        destroyOnClose
        title={"银行账户"}
        open={!!customId}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setCustomId(undefined)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
        footer={null}
        maskClosable={false}
      >
        <Button
          onClick={handleAddBank}
          type="primary"
          style={{ marginBottom: 16, background: "#198348", width: "100px" }}
        >
          添加
        </Button>
        <Table
          bordered
          dataSource={bankData?.entity.data}
          columns={bankColumns}
        />
      </Modal>

      <Modal
        centered
        destroyOnClose
        title={bankOperation === Operation.Add ? "添加账户" : "编辑账户"}
        open={bankModalState}
        onOk={handleBankOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setBankModalState(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
        maskClosable={false}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
          form={form1}
          initialValues={initialValues}
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item label="银行账户" name="bankCard">
            <Input placeholder="请输入银行账户" />
          </Form.Item>
          <Form.Item label="开户银行" name="bank">
            <Input placeholder="请输入开户银行" />
          </Form.Item>
          <Form.Item label="币种" name="moneyType">
            <Select
              showSearch
              labelInValue
              placeholder="币种"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={moneyTypes?.map((con) => ({
                label: con.dictLabel,
                value: con.id,
              }))}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
