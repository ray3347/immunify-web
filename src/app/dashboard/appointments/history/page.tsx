"use client";

import { Table, Typography, Tag, Breadcrumb, TableColumnsType, Space } from "antd";
import { useRouter } from "next/navigation";
import useAppointmentStore, {Appointment} from "../../../../../store/appointmentStore";
import { useActiveSession } from "../../../../utilities/zustand";
import { IClinicAppointment } from "../../../../interfaces/db/IAppointment";
import { appointmentStatusTypes } from "../../../../constants/types";
const { Title } = Typography;

export default function AppointmentHistory() {
  const router = useRouter();
  const {activeAccount} = useActiveSession();
  // const { appointments } = useAppointmentStore();

  // Filter hanya yang status Completed
  const completedAppointments = activeAccount?.clinic.scheduledAppointments.filter(
    (a: IClinicAppointment) => a.status === appointmentStatusTypes.completed
  );

  const columns: TableColumnsType<IClinicAppointment> = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 500 }}>{record.user.fullName}</div>
            <div style={{ color: "#868e96", fontSize: "12px" }}>
              {record.user.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vaccine",
      dataIndex: "vaccineType",
      key: "vaccineType",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.vaccine.vaccineName}</span>
      ),
    },
    {
      title: "Preferred Date",
      dataIndex: "preferredDate",
      key: "preferredDate",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.scheduledDate.toISOString()}</span>
      ),
    },
    {
      title: "Preferred Time",
      dataIndex: "preferredTime",
      key: "preferredTime",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.scheduledTime}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Tag color="#52c41a">Completed</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb
        items={[
          { title: "Dashboard", href: "/" },
          { title: "Appointments", href: "/dashboard/appointments" },
          { title: "History" },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Title level={4}>Appointment History</Title>
      <Table columns={columns} dataSource={completedAppointments} rowKey="key" />
    </div>
  );
}