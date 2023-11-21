import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Select,
  DatePicker,
  notification,
  List,
  Avatar,
} from "antd";
import {
  EditTwoTone,
  ProfileTwoTone,
  DeleteTwoTone,
  CheckCircleTwoTone,
  StopTwoTone,
  CalendarTwoTone,
} from "@ant-design/icons";
import {
  getProjectsApproveList,
  approveOne,
  rejectOne,
  logsOne,
  getProjectType,
} from "@/restApi/project";
import { Company, Operation } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";

const initialValues = {
  name: "",
  address: "",
  contactsName: "",
  contactsMobile: "",
  remark: "",
};

const Project = () => {
  const [data, setData] = useState();
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);

  const [fileName, setFileName] = useState();

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const [projectType, setProjectType] = useState();
  const [logs, setLogs] = useState();

  useEffect(() => {
    (async () => {
      const data = await getProjectsApproveList(page, pageSize, searchValue);
      const typelist = await getProjectType();
      // const file = await exportProject();
      setLoading(false);
      setData(data);
      setProjectType(typelist.entity.data);
      // setFileName(file.msg);
    })();
  }, [page, pageSize, searchValue]);

  const handleEditOne = (record: Company) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    const params = {
      ...values,
      projectDate: dayjs(values.projectDate).format("YYYY-MM-DD"),
    };
    const { code } =
      operation === Operation.Add
        ? await addProject(params)
        : await updateProject(editId, params);
    if (code === 200) {
      setModalOpen(false);
      const data = await getProjectsApproveList(page, pageSize, searchValue);
      setData(data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteOne = async (id: string) => {
    await deleteProject(id);
    const data = await getProjectsApproveList(page, pageSize, searchValue);
    setData(data);
    setLoading(false);
  };

  const handleApproveOne = async (projectId: string) => {
    const res = await approveOne(projectId);
    console.log(res, "res");
    const data = await getProjectsApproveList(page, pageSize, searchValue);
    setData(data);
    setLoading(false);
  };

  const handleRejectOne = async (projectId: string) => {
    const res = await rejectOne(projectId);
    console.log(res, "res");
    const data = await getProjectsApproveList(page, pageSize, searchValue);
    setData(data);
    setLoading(false);
  };

  const handleLogs = async (id: string) => {
    const res = await logsOne(id);
    console.log(res, "res");
    setLogs(res.entity.data);
  };

  const columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "项目类型",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "日期",
      dataIndex: "projectDate",
      key: "projectDate",
    },
    {
      title: "数量",
      dataIndex: "num",
      key: "num",
    },
    {
      title: "收入小计",
      dataIndex: "proIncome",
      key: "proIncome",
    },
    {
      title: "成本小计",
      dataIndex: "proCost",
      key: "proCost",
    },
    {
      title: "利润",
      dataIndex: "profit",
      key: "profit",
    },
    {
      title: "扣除后利润",
      dataIndex: "deductProfit",
      key: "deductProfit",
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
      render: (record: Company) => {
        return (
          <Space size="middle" className="flex flex-row !gap-x-1">
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
              onClick={() => window.open(`/projectYW/${record.id}`)}
            >
              <ProfileTwoTone twoToneColor="#198348" />
            </Button>
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
            <Button
              onClick={() => handleLogs(record.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
            >
              <CalendarTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              onClick={() => handleApproveOne(record.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
            >
              <CheckCircleTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              onClick={() => handleRejectOne(record.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
            >
              <StopTwoTone twoToneColor="#198348" />
            </Button>
            <Button
              onClick={() => handleDeleteOne(record.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 5px",
              }}
            >
              <DeleteTwoTone twoToneColor="#198348" />
            </Button>
          </Space>
        );
      },
    },
  ];

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const validateName = () => {
    return {
      validator: (_, value) => {
        if (value.trim() !== "") {
          return Promise.resolve();
        }
        return Promise.reject(new Error("请输入供应商名称"));
      },
    };
  };

  return (
    <div className="w-full p-2" style={{ color: "#000" }}>
      <div className="flex flex-row gap-y-3 justify-between my-2">
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
        loading={loading}
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
        title={operation === Operation.Add ? "添加项目" : "编辑项目"}
        open={modalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setModalOpen(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
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
            validateTrigger="onBlur"
            rules={[validateName]}
            hasFeedback
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type_id"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "请选择项目类型" }]}
            hasFeedback
          >
            <Select
              showSearch
              placeholder="选择类型"
              optionFilterProp="children"
              // onChange={handleSelectChange}
              // onSearch={handleSelectSearch}
              filterOption={filterOption}
              options={projectType?.map((con) => ({
                value: con.id,
                label: con.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="数量" name="num">
            <Input placeholder="数量" />
          </Form.Item>
          <Form.Item
            label="日期"
            name="projectDate"
            getValueProps={(i) => ({ value: dayjs(i) })}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={6} />
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
    </div>
  );
};

export default Project;
