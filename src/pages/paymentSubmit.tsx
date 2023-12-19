import { useEffect, useState, useCallback } from "react";
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
  Tooltip,
  Popconfirm,
  List,
  Avatar,
  Typography,
  Upload,
  message,
} from "antd";
import { Operation } from "@/types";
import dayjs from "dayjs";
import {
  EditTwoTone,
  DeleteTwoTone,
  CalendarTwoTone,
  InteractionTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getPaymentList,
  addPayment,
  updatePayment,
  logsOne,
  submitToYW,
  getPaymentDetailById,
  deleteOne,
  getFilesById,
  updateFileById,
  deleteFileById,
} from "@/restApi/payment";
import { getProjectsSubmitList } from "@/restApi/project";
import { getSuppliersYFList } from "@/restApi/supplyer";
import { getDictByCode } from "@/restApi/dict";
import DetailModal from "@/components/DetailModal";

const Payment = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [project, setProject] = useState();
  const [supplier, setSupplier] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState();

  const [bank, setBank] = useState();
  const [dict, setDict] = useState();
  const [selectSupplier, setSelectSupplier] = useState();
  const [bankcards, setBankcards] = useState();

  const [detail, setDetail] = useState();
  const [files, setFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getPaymentList(page, pageSize);
      const projectData = await getProjectsSubmitList(1, 10000);
      setData(res);
      setProject(
        projectData.entity.data.filter((item) => item.state === "审批通过")
      );
    })();
  }, [page, pageSize]);

  const handleAdd = async () => {
    setOperation(Operation.Add);
    const res = await getDictByCode("sys_money_type");
    setDict(res.entity);
    setModalOpen(true);
  };

  const handleEditOne = async (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    const projectCustom = await getSuppliersYFList(record.projectId);
    setSupplier(projectCustom.entity.data);
    setSelectSupplier(
      projectCustom.entity?.data?.find((c) => record.supplierId === c.id)
    );
    const res = await getDictByCode("sys_money_type");
    setDict(res.entity);
    const rawFilelist = await getFilesById(record.id);
    const fileList = rawFilelist?.entity.data.map((item) => ({
      name: item.originalFileName,
      url: item.url,
      uid: item.uid,
      id: item.id,
      status: "done",
    }));

    setFiles(fileList);
    setOldFiles(fileList);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();

    console.log(values, "values");

    const params =
      operation === Operation.Add
        ? {
            ...values,
            moneyType: values.moneyType.value || "",
            projectName: values.projectName.label || "",
            projectId: values.projectName.value || "",
            supplierName: values.supplierName.label || "",
            supplierId: values.supplierName.value || "",
            bank: values.bank.value || "",
            bankCard: values.bankCard.value || "",
            taxationNumber: selectSupplier?.taxationNumber || "",
            fee: values.fee || "",
            remark: values.remark || "",
          }
        : {
            ...values,
            moneyType: values.moneyType.value || values.moneyType || "",
            projectName: values.projectName?.label || values.projectName || "",
            projectId:
              values.projectName?.value ||
              project?.find((c) => c.name === values.projectName).id ||
              "",
            supplierName:
              values.supplierName?.label || values.supplierName || "",
            supplierId:
              values.supplierName?.value ||
              supplier?.find((a) => a.name === values.supplierName).id ||
              "",
            bank: values.bank.value || values.bank || "",
            bankCard: values.bankCard.value || values.bankCard || "",
            taxationNumber: selectSupplier?.taxationNumber || "",
            fee: values.fee || "",
            remark: values.remark || "",
            // files,
          };

    console.log(params, "params");

    if (operation === Operation.Add) {
      const formData = new FormData();
      for (const name in params) {
        formData.append(name, params[name]);
      }
      files.forEach((file) => {
        formData.append("files", file);
      });
      await addPayment(formData);
    } else {
      await updatePayment(editId, params);

      const formData = new FormData();
      formData.append("paymentId", editId);

      console.log(files, "files");
      console.log(oldFiles, "oldFiles");
      const fileList = files.filter((item) => oldFiles.indexOf(item.id) < 0);
      console.log(fileList, "fileList");

      if (fileList.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
        await updateFileById(formData);
      }
    }
    setOldFiles([]);
    setFiles([]);
    setModalOpen(false);
    const data = await getPaymentList(page, pageSize);
    setLoading(false);
    setData(data);
    notification.success({
      message: operation === Operation.Add ? "添加成功" : "编辑成功",
      duration: 3,
    });
  };

  const handleDetail = async (id) => {
    const res = await getPaymentDetailById(id);
    setDetail(res.entity.data);
  };

  const handleLogsOne = async (id: string) => {
    const res = await logsOne(id);
    setLogs(res.entity.data);
  };

  const handleDeleteOne = async (id: string) => {
    await deleteOne(id);
    const data = await getPaymentList(page, pageSize);
    setData(data);
  };

  const handleSubmitOne = async () => {
    await submitToYW(detail.id);
    notification.success({ message: "提交成功" });
    setDetail(undefined);
    const data = await getPaymentList(page, pageSize);
    setData(data);
  };

  const handleProjectChanged = async (param) => {
    form.setFieldValue("supplierName", {});
    form.setFieldValue("moneyType", {});
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    const projectCustom = await getSuppliersYFList(param.value);
    setSupplier(projectCustom.entity.data);
  };

  const handleSupplierChange = async (value) => {
    form.setFieldValue("moneyType", {});
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    setSelectSupplier(supplier?.find((c) => c.id === value.value));
  };

  const onSearch = () => {};

  const handleMoneyTypeChnage = (value) => {
    form.setFieldValue("bankCard", {});
    form.setFieldValue("bank", {});
    const res = selectSupplier?.accountList?.filter(
      (c) => c.moneyType === value.value
    );
    setBankcards(res);
  };

  const handleBankCardChange = (value) => {
    form.setFieldValue("bank", {});
    const res = bankcards?.filter((c) => c.bankCard === value.value);
    setBank(res);
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

  const columns = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "供应商",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "金额",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "币种",
      dataIndex: "moneyType",
      key: "moneyType",
    },
    {
      title: "审核状态",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "税号",
      dataIndex: "taxationNumber",
      key: "taxationNumber",
    },
    {
      title: "银行卡号",
      dataIndex: "bankCard",
      key: "bankCard",
    },
    {
      title: "开户行",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "申请人",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "应付日期",
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
    multiple: true,
    fileList: files,
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    showUploadList: {
      showDownloadIcon: true,
    },
    onRemove: async (file) => {
      await deleteFileById(file?.id);
      const index = files.indexOf(file);
      const newFiles = files.slice();
      newFiles.splice(index, 1);
      setFiles(newFiles);
    },
    beforeUpload: (file) => {
      setFiles([...files, file]);
      return false;
    },
    onDownload: async (file) => {
      window.open(
        `http://123.60.88.8/zc/common/download/resource?resource=${file?.url}`
      );
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
            // value={searchValue}
            // onChange={(e) => setSearchValue(e.target.value)}
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
        onCancel={() => setModalOpen(false)}
        afterClose={() => {
          form.resetFields();
          setSelectSupplier(undefined);
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
              onSearch={onSearch}
              labelInValue
              placeholder="选择项目"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={project?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
              onChange={handleProjectChanged}
            />
          </Form.Item>
          <Form.Item
            label="供应商"
            name="supplierName"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              labelInValue
              placeholder="选择供应商"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              onChange={handleSupplierChange}
              options={supplier?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>

          <Form.Item required label="金额" name="fee">
            <Input placeholder="金额" />
          </Form.Item>
          <Form.Item label="税号" name="taxationNumber">
            {/* <Input placeholder="税号" /> */}
            <Typography>
              <code>{selectSupplier?.taxationNumber}</code>
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

          <Form.Item
            label="应付日期"
            name="yfDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="附件"
            // name="files"
            getValueFromEvent={({ file }) => file.originFileObj}
          >
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

export default Payment;
