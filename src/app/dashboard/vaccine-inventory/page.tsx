"use client";
import { useEffect, useState } from "react";
import { Table, Select, InputNumber, Button, Space, Typography, Popconfirm, notification, Input, Tag, Modal, Form } from "antd";
import useVaccineInventoryStore from "../../../../store/vaccineInventoryStore";
import { Vaccine } from "@/type";
import '@ant-design/v5-patch-for-react-19';
import { message, notification as customNotification } from '../../../../store/message';

const { Option } = Select;
const { Title } = Typography;

const dummyVaccines: Vaccine[] = [
  { id: "v1", name: "MMR", clinicId: "c1" },
  { id: "v2", name: "Hepatitis B", clinicId: "c1" },
  { id: "v3", name: "Polio", clinicId: "c1" },
  { id: "v4", name: "COVID-19 Booster", clinicId: "c1" }, 
  { id: "v5", name: "HPV Vaccine", clinicId: "c1" },             
];

const dummyStocks = [
  { vaccineId: "v1", quantity: 0 },
  { vaccineId: "v2", quantity: 0 },
  { vaccineId: "v3", quantity: 0 },
  { vaccineId: "v4", quantity: 0 },
  { vaccineId: "v5", quantity: 0 },
];

export default function VaccineInventoryPage() {
  const { vaccines, stocks, addStock, setVaccines, setStocks } = useVaccineInventoryStore();
  const [selectedVaccine, setSelectedVaccine] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<number>(0);

  useEffect(() => {
    if (vaccines.length === 0) setVaccines(dummyVaccines);
    if (stocks.length === 0) setStocks(dummyStocks);
    setMounted(true);
  }, []);

  const handleAddStock = () => {
    if (selectedVaccine && qty > 0) {
      addStock(selectedVaccine, qty);
      message.success('Success!');
      setModalOpen(false);
      setSelectedVaccine("");
      setQty(1);
    }
  };

  
  // Filter vaccines by search
  const filteredVaccines = vaccines.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (vaccineId: string) => {
    const stock = stocks.find(s => s.vaccineId === vaccineId)?.quantity ?? 0;
    setEditingId(vaccineId);
    setEditingQty(stock);
  };

  const handleSaveClick = (vaccineId: string) => {
    setStocks(
      stocks.map(stock =>
        stock.vaccineId === vaccineId ? { ...stock, quantity: editingQty } : stock
      )
    );
    setEditingId(null);
  };

  const columns = [
    {
      title: "Vaccine Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (_: any, record: Vaccine) => {
        const stock = stocks.find(s => s.vaccineId === record.id)?.quantity ?? 0;
        if (editingId === record.id) {
          return (
            <InputNumber
              min={0}
              value={editingQty}
              onChange={value => setEditingQty(Number(value))}
              style={{ width: 100 }}
            />
          );
        }
        return stock;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Vaccine) => {
        const stock = stocks.find(s => s.vaccineId === record.id)?.quantity ?? 0;
        if (stock === 0) {
          return <Tag color="red">No Stock</Tag>;
        } else if (stock <= 20) {
          return <Tag color="orange">Low Stock</Tag>;
        } else {
          return <Tag color="green">In Stock</Tag>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Vaccine) => (
        editingId === record.id ? (
          <Button type="primary" onClick={() => handleSaveClick(record.id)}>
            Save
          </Button>
        ) : (
          <Button onClick={() => handleEditClick(record.id)}>
            Edit
          </Button>
        )
      ),
    },
  ];

  if (!mounted) return null; 

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 0, flex: 1 }}>Vaccine Inventory</Title>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Stock
        </Button>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search vaccine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />
      </Space>
      <Table
        dataSource={filteredVaccines}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title="Add Vaccine Stock"
        open={modalOpen}
        onOk={handleAddStock}
        onCancel={() => setModalOpen(false)}
        okText="Add"
        destroyOnHidden
        okButtonProps={{ disabled: !selectedVaccine || qty < 1 }}
      >
        <Form layout="vertical">
          <Form.Item label="Vaccine">
            <Select
              placeholder="Select Vaccine"
              style={{ width: "100%" }}
              value={selectedVaccine || undefined}
              onChange={setSelectedVaccine}
            >
              {vaccines.map(v => (
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber
              min={1}
              value={qty}
              onChange={value => setQty(Number(value))}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}