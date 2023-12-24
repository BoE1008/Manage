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
} from "antd";
import { Operation } from "@/types";
import dayjs from "dayjs";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { addDept, updateDept, deleteDept, getDeptTree } from "@/restApi/dept";

const Dept = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>(Operation.Add);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getDeptTree();
      setData(res?.entity.data);
    })();
  }, []);

  const handleAdd = async () => {
    setOperation(Operation.Add);
    setModalOpen(true);
  };

  const handleEditOne = (record) => {
    setOperation(Operation.Edit);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    const { code } =
      operation === Operation.Add
        ? await addDept(values)
        : await updateDept(editId, values);
    if (code === 200) {
      setModalOpen(false);
      const data = await getDeptTree();
      setLoading(false);
      setData(res?.entity.data);
      notification.success({
        message: operation === Operation.Add ? "添加成功" : "编辑成功",
        duration: 3,
      });
    }
  };

  const handleDeleteOne = async (id: string) => {
    await deleteDept(id);
    const data = await getDeptTree();
    setLoading(false);
    setData(res?.entity.data);
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
      title: "部门名称",
      dataIndex: "title",
      align: "center",
      key: "title",
    },
    {
      title: "id",
      dataIndex: "id",
      align: "center",
      key: "id",
    },
    {
      title: "部门排序",
      dataIndex: "orderSort",
      align: "center",
      key: "orderSort",
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
              onClick={() => handleEditOne(record)}
            >
              <EditTwoTone twoToneColor="#198348" />
            </Button>
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

  const expandedRowRender = (record) => {
    return (
      <div>
        <Table
          bordered
          loading={loading}
          dataSource={record.children
            .map((item, index) => ({
              ...item,
              key: index,
            }))
            .filter((c) => c.state !== "未提交")}
          columns={columns}
          pagination={false}
        />
      </div>
    );
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
        pagination={false}
        dataSource={data}
        columns={columns}
        // expandable={{
        //   expandedRowRender: (record) => expandedRowRender(record),
        //   defaultExpandedRowKeys: ["0"],
        //   expandRowByClick: true,
        //   indentSize: 300,
        // }}
      />

      <Modal
        centered
        destroyOnClose
        title={operation === Operation.Add ? "添加部门" : "编辑部门"}
        open={modalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: "#198348" } }}
        // confirmLoading={confirmLoading}
        onCancel={() => setModalOpen(false)}
        afterClose={() => form.resetFields()}
        style={{ minWidth: "650px" }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout={"horizontal"}
          form={form}
          style={{ minWidth: 600, color: "#000" }}
        >
          <Form.Item required label="部门名称" name="name">
            <Input placeholder="部门名称" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="备注" maxLength={100} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dept;
