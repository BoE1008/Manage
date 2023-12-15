import {
  getinvoicingList,
  addInvoicing,
  updateInvoicing,
  logsOne,
  submitToYw,
  getInvoicingDetailById,
  deleteOne,
} from "@/restApi/invoicing";
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
  List,
  Avatar,
  Tooltip,
  Popconfirm,
  Typography,
  Upload,
  message,
} from "antd";
import { Operation } from "@/types";
import { getProjectsSubmitList } from "@/restApi/project";
import {
  EditTwoTone,
  DeleteTwoTone,
  CalendarTwoTone,
  InteractionTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import { getCustomersYSList } from "@/restApi/customer";
import { InvoicingTypeArr } from "@/utils/const";
import { getDictByCode } from "@/restApi/dict";
import DetailModal from "@/components/DetailModal";

const InvoicingSubmit = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [customer, setCustomer] = useState();
  const [project, setProject] = useState();
  const [logs, setLogs] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  const [dict, setDict] = useState();
  const [invoicingContent, setinvoicingContent] = useState();
  const [bankcards, setBankcards] = useState();
  const [bank, setBank] = useState();

  const [selectCustomer, setSelectCustomer] = useState();

  const [detail, setDetail] = useState();

  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getinvoicingList(page, pageSize, searchValue);
      const projectData = await getProjectsSubmitList(1, 10000);
      setData(res);
      setProject(
        projectData.entity.data.filter((item) => item.state === "审批通过")
      );
    })();
  }, [page, pageSize, searchValue]);

  const handleAdd = async () => {
    setOperation(Operation.Add);
    const res = await getDictByCode("sys_money_type");
    const data = await getDictByCode("sys_invoicing_content");
    setDict(res.entity);
    setinvoicingContent(data.entity);
    setModalOpen(true);
  };

  const handleEditOne = async (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    const projectCustom = await getCustomersYSList(record.projectId);
    setCustomer(projectCustom.entity.data);
    setSelectCustomer(
      projectCustom.entity?.data?.find((c) => record.customId === c.id)
    );
    const res = await getDictByCode("sys_money_type");
    setDict(res.entity);
    const data = await getDictByCode("sys_invoicing_content");
    setinvoicingContent(data.entity);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const params = {
      ...values,
      invoicingType: values.invoicingType?.value,
      moneyType: values.moneyType?.value,
      projectId: values.projectName?.value,
      projectName: values.projectName?.label,
      customId: values.customName?.value,
      customName: values.customName?.label,
      bankCard: values.bankCard.value,
      bank: values.bank.value,
      taxationNumber: selectCustomer?.taxationNumber,
      content: values.content?.value,
      files: new FormData().append('files', files),
    };

    setLoading(true);
    const { code } =
      operation === Operation.Add
        ? await addInvoicing(params)
        : await updateInvoicing(editId, params);
    if (code === 200) {
      setModalOpen(false);
      const data = await getinvoicingList(page, pageSize);
      setLoading(false);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDetail = async (id) => {
    const res = await getInvoicingDetailById(id);
    setDetail(res.entity.data);
  };

  const handleSubmitOne = async () => {
    await submitToYw(detail.id);
    notification.success({ message: "提交成功" });
    setDetail(undefined);
    const data = await getinvoicingList(page, pageSize);
    setData(data);
  };

  const handleLogsOne = async (id: string) => {
    const res = await logsOne(id);
    setLogs(res.entity.data);
  };

  const handleDeleteOne = async (id: string) => {
    await deleteOne(id);
    const data = await getinvoicingList(page, pageSize);
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

  const handleProjectChanged = async (param) => {
    form.setFieldValue("customName", {});
    form.setFieldValue("moneyType", {});
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    const projectCustom = await getCustomersYSList(param.value);
    setCustomer(projectCustom.entity.data);
  };

  const handleCustomerChange = async (value) => {
    form.setFieldValue("moneyType", {});
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    setSelectCustomer(customer?.find((c) => c.id === value.value));
  };

  const onSearch = () => {};

  const handleMoneyTypeChnage = (value) => {
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    const res = selectCustomer?.accountList?.filter(
      (c) => c.moneyType === value.value
    );
    setBankcards(res);
  };

  const handleBankCardChange = (value) => {
    form.setFieldValue("bank", {});
    const res = bankcards?.filter((c) => c.bankCard === value.value);
    setBank(res);
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
      title: "客戶名称",
      dataIndex: "customName",
      key: "customName",
    },
    {
      title: "开票票种",
      dataIndex: "invoicingType",
      key: "invoicingType",
    },
    {
      title: "开票内容",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "开票币种",
      dataIndex: "moneyType",
      key: "moneyType",
    },
    {
      title: "开票金额",
      dataIndex: "fee",
      key: "fee",
    },

    {
      title: "税号",
      dataIndex: "taxationNumber",
      key: "taxationNumber",
    },
    {
      title: "开户行",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "卡号",
      dataIndex: "bankCard",
      key: "bankCard",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "申请人",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "申请时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "审核状态",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        const isFinished = record.state === "审批通过";
        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            {!isFinished && (
              <Tooltip title={<span>提交业务审核</span>}>
                <Popconfirm
                  title="是否提交审核？"
                  okButtonProps={{ style: { backgroundColor: "#198348" } }}
                  onConfirm={() => handleDetail(record.id)}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 5px",
                    }}
                  >
                    <InteractionTwoTone twoToneColor="#198348" />
                  </Button>
                </Popconfirm>
              </Tooltip>
            )}
            {!isFinished && (
              <Tooltip title="编辑">
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
              </Tooltip>
            )}
            <Tooltip title="查看审核日志">
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "3px 5px",
                }}
                onClick={() => handleLogsOne(record.id)}
              >
                <CalendarTwoTone twoToneColor="#198348" />
              </Button>
            </Tooltip>
            {!isFinished && (
              <Tooltip title="删除">
                <Popconfirm
                  title="是否删除？"
                  okButtonProps={{ style: { backgroundColor: "#198348" } }}
                  onConfirm={() => handleDeleteOne(record.id)}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 5px",
                    }}
                  >
                    <DeleteTwoTone twoToneColor="#198348" />
                  </Button>
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  const uploadProps = {
    accept: ".pdf,.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.rar,.zip",
    name: "file",
    // multiple: true,
    fileList: files,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // beforeUpload: (f, fList) => false,
    onChange: ({ file, fileList }) => {
      setFiles(fileList);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
        onCancel={() => {
          setFiles([]);
          setModalOpen(false);
        }}
        afterClose={() => {
          form.resetFields();
          setSelectCustomer(undefined);
        }}
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
              labelInValue
              placeholder="选择项目"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onSearch={onSearch}
              optionLabelProp="label"
              options={project?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
              onChange={handleProjectChanged}
            />
          </Form.Item>
          <Form.Item
            label="客户"
            name="customName"
            dependencies={["projectName"]}
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              labelInValue
              placeholder="选择客户"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onChange={handleCustomerChange}
              options={customer?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item required label="票种" name="invoicingType">
            <Select
              labelInValue
              placeholder="选择票种"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={InvoicingTypeArr?.map((con) => ({
                label: con,
                value: con,
              }))}
            ></Select>
          </Form.Item>

          <Form.Item required label="内容" name="content">
            <Select
              labelInValue
              placeholder="选择开票内容"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onChange={handleMoneyTypeChnage}
              options={invoicingContent?.map((con) => ({
                label: con.dictLabel,
                value: con.dictLabel,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item required label="金额" name="fee">
            <Input placeholder="金额" />
          </Form.Item>
          <Form.Item label="税号" name="taxationNumber">
            {/* <Input placeholder="税号" /> */}
            <Typography>
              <code>{selectCustomer?.taxationNumber}</code>
            </Typography>
          </Form.Item>
          <Form.Item required label="币种" name="moneyType">
            <Select
              labelInValue
              placeholder="选择币种"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onChange={handleMoneyTypeChnage}
              options={dict?.map((con) => ({
                label: con.dictLabel,
                value: con.dictLabel,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="卡号" name="bankCard">
            <Select
              labelInValue
              placeholder="选择银行卡"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onChange={handleBankCardChange}
              options={bankcards?.map((con) => ({
                label: con.bankCard,
                value: con.bankCard,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="开户行" name="bank">
            <Select
              labelInValue
              placeholder="选择开户行"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              defaultActiveFirstOption
              defaultValue={{ label: bank?.[0].bank, value: bank?.[0].bank }}
              options={bank?.map((con) => ({
                label: con.bank,
                value: con.bank,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={100} />
          </Form.Item>

          <Form.Item label="附件" name="annex">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        centered
        destroyOnClose
        footer={null}
        title={"审核日志"}
        open={!!logs}
        style={{ minWidth: "650px" }}
        onCancel={() => setLogs(undefined)}
      >
        <List
          pagination={{ position: "bottom", align: "end" }}
          dataSource={logs}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={item.state}
                description={`${item.userName} ${item.createTime} 备注：${
                  item.remark || ""
                } `}
              />
            </List.Item>
          )}
        />
      </Modal>

      <DetailModal
        data={detail}
        onConfirm={handleSubmitOne}
        onClose={() => setDetail(undefined)}
      />
    </div>
  );
};

export default InvoicingSubmit;
