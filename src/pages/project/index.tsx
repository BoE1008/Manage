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
} from "antd";
import { EditTwoTone, ProfileTwoTone } from "@ant-design/icons";
import {
  getProjectsList,
  addProject,
  updateProject,
  getProjectType,
} from "@/restApi/project";
import { Company, Operation } from "@/types";
import Link from "next/link";
import zhCN from "antd/es/date-picker/locale/zh_CN";
import "dayjs/locale/zh-cn";
// import dayjs from "dayjs";

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

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const [projectType, setProjectType] = useState();

  useEffect(() => {
    (async () => {
      const data = await getProjectsList(page, pageSize, searchValue);
      const typelist = await getProjectType();
      setLoading(false);
      setData(data);
      setProjectType(typelist.entity.data);
    })();
  }, [page, pageSize, searchValue]);

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
    const params = {
      ...values,
      // projectDate: dayjs(values.projectDate, "YYYY-MM-DD"),
    };
    console.log(values, "values");
    console.log(params, "params");
    const { code } =
      operation === Operation.Add
        ? await addProject(values)
        : await updateProject(editId, values);
    if (code === 200) {
      setModalOpen(false);
      const data = await getProjectsList(page, pageSize, searchValue);
      setData(data);
    }
  };

  const columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "typeId",
      dataIndex: "typeId",
      key: "typeId",
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
      title: "操作",
      key: "action",
      render: (record: Company) => {
        return (
          <Space size="middle">
            <Button
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
            <Link
              href={`/project/${record.id}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ProfileTwoTone twoToneColor="#198348" />
            </Link>
          </Space>
        );
      },
    },
  ];

  const handleSelectChange = (value) => {
    console.log(value, "change");
  };

  const handleSelectSearch = (value) => {
    console.log(value, "search");
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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
        title={operation === Operation.Add ? "添加供应商" : "编辑供应商"}
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
          <Form.Item required label="名称" name="name">
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="类型" name="type_id">
            <Select
              showSearch
              placeholder="选择类型"
              optionFilterProp="children"
              onChange={handleSelectChange}
              onSearch={handleSelectSearch}
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
          {/* <Form.Item label="日期" name="projectDate">
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default Project;
