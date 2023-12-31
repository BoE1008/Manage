import {
  getinvoicingYWList,
  updateInvoicing,
  submitToCw,
  rejectOne,
  logsOne,
  getInvoicingDetailById,
} from "@/restApi/invoicing";
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
  List,
  Avatar,
  Tooltip,
  Popconfirm,
} from "antd";
import { Operation } from "@/types";
import dayjs from "dayjs";
import { getProjectsSubmitList } from "@/restApi/project";
import {
  DeleteTwoTone,
  CheckCircleTwoTone,
  CalendarTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import { getCustomersYSList } from "@/restApi/customer";
import RejectModal from "@/components/RejectModal";
import InvoicingSubmitModal from "@/components/InvoicingSubmitModal";
import InvoicingDetailModal from "@/components/InvoicingDetailModal";
import { formatNumber } from "@/utils";

const InvoicingSubmit = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [customer, setCustomer] = useState();
  const [project, setProject] = useState();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [logs, setLogs] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  const [rejectId, setRejectId] = useState();

  const [detail, setDetail] = useState();
  const [check, setCheck] = useState();

  useEffect(() => {
    (async () => {
      const res = await getinvoicingYWList(page, pageSize);
      const projectData = await getProjectsSubmitList(1, 10000);
      setData(res);
      setProject(
        projectData.entity.data.filter((item) => item.state === "审批通过")
      );
    })();
  }, [page, pageSize]);

  const handleEditOne = (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleLogsOne = async (id: string) => {
    const res = await logsOne(id);
    setLogs(res.entity.data);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const params = {
      ...values,
      projectId: values.projectName.value,
      projectName: values.projectName.label,
      customId: values.customName.value,
      customName: values.customName.label,
    };
    setLoading(true);
    const { code } = await updateInvoicing(editId, params);
    if (code === 200) {
      setModalOpen(false);
      const data = await getinvoicingYWList(page, pageSize);
      setLoading(false);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleReject = async (invoicingId: string, remark: string) => {
    await rejectOne(invoicingId, remark, 1);
    setRejectId(undefined);
    notification.success({ message: "申请已退回" });
    const data = await getinvoicingYWList(page, pageSize);
    setLoading(false);
    setData(data);
  };

  const handleDeleteOne = async (id: string) => {};

  const handleProjectChanged = async (param) => {
    const projectCustom = await getCustomersYSList(param.value);
    setCustomer(projectCustom.entity.data);
  };

  const handleDetail = async (id) => {
    const res = await getInvoicingDetailById(id);
    setDetail(res.entity.data);
  };

  const handleCheck = async (id) => {
    const res = await getInvoicingDetailById(id);
    setCheck(res.entity.data);
  };

  const handleSubmitToCW = async () => {
    await submitToCw(detail.id);
    notification.success({ message: "已提交至财务审核" });
    setDetail(undefined);
    const res = await getinvoicingYWList(page, pageSize);
    setData(res);
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
      title: "项目编号",
      dataIndex: "projectNum",
      align: "center",
      key: "projectNum",
    },
    {
      title: "项目名称",
      align: "center",
      key: "projectName",
      render: (record) => {
        return (
          <span
            className="cursor-pointer text-[#198348]"
            onClick={() => handleCheck(record.id)}
          >
            {record.projectName}
          </span>
        );
      },
    },
    {
      title: "客戶名称",
      dataIndex: "customName",
      align: "center",
      key: "customName",
    },
    {
      title: "开票票种",
      dataIndex: "invoicingType",
      align: "center",
      key: "invoicingType",
    },
    {
      title: "开票内容",
      dataIndex: "content",
      align: "center",
      key: "content",
    },
    {
      title: "开票币种",
      dataIndex: "moneyType",
      align: "center",
      key: "moneyType",
    },
    {
      title: "开票金额",
      // dataIndex: "fee",
      align: "center",
      key: "fee",
      render: (record) => formatNumber(record?.fee),
    },

    {
      title: "税号",
      dataIndex: "taxationNumber",
      align: "center",
      key: "taxationNumber",
    },
    {
      title: "开户行",
      dataIndex: "bank",
      align: "center",
      key: "bank",
    },
    {
      title: "卡号",
      dataIndex: "bankCard",
      align: "center",
      key: "bankCard",
    },
    {
      title: "地址",
      dataIndex: "address",
      align: "center",
      key: "address",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      align: "center",
      key: "phone",
    },
    {
      title: "申请人",
      dataIndex: "userName",
      align: "center",
      key: "userName",
    },
    {
      title: "申请时间",
      dataIndex: "createTime",
      align: "center",
      key: "createTime",
    },
    {
      title: "审核状态",
      dataIndex: "state",
      align: "center",
      key: "state",
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
        const isFinished = record.state === "审批通过";

        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            {/* {!isFinished&&<Tooltip title="编辑">
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
            </Tooltip>} */}
            {!isFinished && (
              <Tooltip title="提交至财务审核">
                <Popconfirm
                  title="提交至财务审核？"
                  getPopupContainer={(node) => node.parentElement}
                  okButtonProps={{ style: { backgroundColor: "#198348" } }}
                  // onConfirm={() => handleSubmitToCW(record.id)}
                  onConfirm={() => handleDetail(record.id)}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 5px",
                    }}
                  >
                    <CheckCircleTwoTone twoToneColor="#198348" />
                  </Button>
                </Popconfirm>
              </Tooltip>
            )}
            {!isFinished && (
              <Tooltip title="退回申请">
                <Popconfirm
                  title="是否退回申请？"
                  getPopupContainer={(node) => node.parentElement}
                  okButtonProps={{ style: { backgroundColor: "#198348" } }}
                  onConfirm={() => setRejectId(record.id)}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 5px",
                    }}
                  >
                    <StopTwoTone twoToneColor="#198348" />
                  </Button>
                </Popconfirm>
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
            {/* {!isFinished && (
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
            )} */}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-2">
      {/* <div className="flex flex-row gap-y-3 justify-between">
        <Space>
          <Input
            placeholder="名称"
            // value={searchValue}
            // onChange={(e) => setSearchValue(e.target.value)}
          />
        </Space>
      </div> */}
      <Table
        bordered
        // loading={loading}
        dataSource={data?.entity.data}
        scroll={{ scrollToFirstRowOnChange: true, y: "800px" }}
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
        title={"编辑申请"}
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
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item
            label="项目"
            name="projectName"
            rules={[{ required: true, message: "项目名称不能为空" }]}
          >
            <Select
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
            label="客户"
            name="customName"
            rules={[{ required: true, message: "客户名称不能为空" }]}
          >
            <Select
              labelInValue
              placeholder="选择客户"
              optionFilterProp="children"
              filterOption={customerFilterOption}
              options={customer?.map((con) => ({
                label: con.name,
                value: con.id,
              }))}
            />
          </Form.Item>
          <Form.Item required label="票种" name="invoicingType">
            <Input placeholder="票种" />
          </Form.Item>
          <Form.Item required label="内容" name="content">
            <Input placeholder="内容" />
          </Form.Item>
          <Form.Item required label="币种" name="moneyType">
            <Input placeholder="币种" />
          </Form.Item>
          <Form.Item required label="金额" name="fee">
            <Input placeholder="金额" />
          </Form.Item>
          <Form.Item label="税号" name="taxationNumber">
            <Input placeholder="税号" />
          </Form.Item>
          <Form.Item label="开户行" name="bank">
            <Input placeholder="开户行" />
          </Form.Item>
          <Form.Item label="卡号" name="bankCard">
            <Input placeholder="卡号" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="地址" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="联系电话" />
          </Form.Item>
          <Form.Item required label="申请人" name="createBy">
            <Input placeholder="申请人" />
          </Form.Item>
          <Form.Item
            label="申请时间"
            name="projectDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={100} />
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
        maskClosable={false}
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

      {!!check && (
        <InvoicingDetailModal
          data={check}
          onClose={() => setCheck(undefined)}
        />
      )}

      {!!detail && (
        <InvoicingSubmitModal
          data={detail}
          onConfirm={handleSubmitToCW}
          onClose={() => setDetail(undefined)}
        />
      )}

      {!!rejectId && (
        <RejectModal
          open={!!rejectId}
          onClose={() => setRejectId(undefined)}
          onReject={(value) => handleReject(rejectId, value)}
        />
      )}
    </div>
  );
};

export default InvoicingSubmit;
