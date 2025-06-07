"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Popconfirm,
  notification,
  Input,
  Tag,
  Modal,
  Form,
} from "antd";
import useVaccineInventoryStore from "../../../../store/vaccineInventoryStore";
import { Vaccine } from "@/type";
import "@ant-design/v5-patch-for-react-19";
import {
  message,
  notification as customNotification,
} from "../../../../store/message";
import { useActiveSession } from "../../../utilities/zustand";
import { IVaccineStock } from "../../../interfaces/db/IClinic";
import { IVaccine } from "../../../interfaces/db/IVaccine";
import { getVaccineList, modifyVaccineStock } from "./util";

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
  // const { vaccines, stocks, addStock, setVaccines, setStocks } = useVaccineInventoryStore();

  const { activeAccount, switchAccount } = useActiveSession();

  const [selectedVaccine, setSelectedVaccine] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<number>(0);
  const [allVaccineList, setAllVaccineList] = useState<IVaccine[]>([]);

  useEffect(() => {
    // if (vaccines.length === 0) setVaccines(dummyVaccines);
    // if (stocks.length === 0) setStocks(dummyStocks);
    setMounted(true);
  }, []);

  const handleAddStock = async () => {
    if (selectedVaccine && qty > 0) {
      // addStock(selectedVaccine, qty);
      const vaccine = allVaccineList.find((v) => v.id == selectedVaccine);
      if (vaccine) {
        const body: IVaccineStock = {
          id: "",
          stock: qty,
          vaccine: vaccine,
        };
        await modifyVaccineStock(activeAccount?.id ?? "", body);
        message.success("Success!");
        setModalOpen(false);
        setSelectedVaccine("");
      }
      window.location.reload();
      // setQty(1);

      // call api modify stock
    }
  };

  // Filter vaccines by search
  const filteredVaccines = activeAccount?.clinic.availableVaccines.filter((v) =>
    v.vaccine.vaccineName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (vaccineId: string) => {
    const stock =
      activeAccount?.clinic.availableVaccines.find((s) => s.id === vaccineId)
        ?.stock ?? 0;
    setEditingId(vaccineId);
    setEditingQty(stock);
  };

  const handleSaveClick = async (vaccineId: string) => {
    // setStocks(
    //   stocks.map(stock =>
    //     stock.vaccineId === vaccineId ? { ...stock, quantity: editingQty } : stock
    //   )
    // );

    // call api modify stock and get clinic by id
    const vaccine = activeAccount?.clinic.availableVaccines.find(
      (v) => v.id == vaccineId
    );
    if (vaccine) {
      const updateVaccine = {
        ...vaccine,
        stock: editingQty,
      };
      await modifyVaccineStock(activeAccount?.id ?? "", updateVaccine);
    }
    setEditingId(null);
    window.location.reload();
  };

  const columns = [
    {
      title: "Vaccine Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: IVaccineStock) => {
        const name = activeAccount?.clinic.availableVaccines.find(
          (s) => s.id === record.id
        )?.vaccine.vaccineName;
        return name;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (_: any, record: IVaccineStock) => {
        const stock =
          activeAccount?.clinic.availableVaccines.find(
            (s) => s.id === record.id
          )?.stock ?? 0;
        if (editingId === record.id) {
          return (
            <InputNumber
              min={0}
              value={editingQty}
              onChange={(value) => setEditingQty(Number(value))}
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
      render: (_: any, record: IVaccineStock) => {
        const stock =
          activeAccount?.clinic.availableVaccines.find(
            (s) => s.id === record.id
          )?.stock ?? 0;
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
      render: (_: any, record: IVaccineStock) =>
        editingId === record.id ? (
          <Button type="primary" onClick={() => handleSaveClick(record.id)}>
            Save
          </Button>
        ) : (
          <Button onClick={() => handleEditClick(record.id)}>Edit</Button>
        ),
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 0, flex: 1 }}>
          Vaccine Inventory
        </Title>
        <Button
          type="primary"
          onClick={async () => {
            const vaccines = await getVaccineList();
            setAllVaccineList(vaccines);
            setModalOpen(true);
          }}
        >
          Add Stock
        </Button>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search vaccine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              {/* {vaccines.map(v => (
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))} */}
              {allVaccineList.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.vaccineName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber
              min={1}
              value={qty}
              onChange={(value) => setQty(Number(value))}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
