"use client";

import React, { useEffect } from "react";
import { Typography, Row, Col, Divider, List, Button } from "antd";
import { Syringe, CalendarClock } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { useRouter } from "next/navigation";
import useAppointmentStore from "../../../store/appointmentStore";
import useVaccineInventoryStore from "../../../store/vaccineInventoryStore";
import { useActiveSession } from "../../utilities/zustand";
import { appointmentStatusTypes } from "../../constants/types";

const { Title } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const {activeAccount} = useActiveSession();
  // const { appointments } = useAppointmentStore();
  // const { vaccines, stocks } = useVaccineInventoryStore();

  useEffect(()=>{
    console.log(activeAccount);
  },[])

  // Data summary
  const totalScheduled = activeAccount?.clinic.scheduledAppointments.filter((a) => a.status === appointmentStatusTypes.scheduled).length;
  const totalPending = activeAccount?.clinic.scheduledAppointments.filter((a) => a.status === appointmentStatusTypes.pending).length;

  // Daily avg (dummy: total scheduled / unique date count)
  const uniqueDates = [
    ...new Set(activeAccount?.clinic.scheduledAppointments.filter((a) => a.status === appointmentStatusTypes.scheduled).map((a) => a.scheduledDate)),
  ];
  const dailyAvg = uniqueDates.length > 0 && totalScheduled ? Math.round(totalScheduled / uniqueDates.length) : 0;

  // Upcoming appointments (ambil 5 terdekat, hanya status scheduled, urutkan by date)
  const upcoming = activeAccount?.clinic.scheduledAppointments
    .filter((a) => a.status === appointmentStatusTypes.scheduled)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  // Low stock vaccines (stock ≤ 3)
  const lowStocks = activeAccount?.clinic.availableVaccines
    .filter((s) => s.stock <= 3)
    // .map((s) => ({
    //   ...s,
    //   vaccine: s..find((v) => v.id === s.vaccineId),
    // }))
    // .filter((s) => s.vaccine);

  return (
    <div>
      <Title level={3} style={{ margin: 0, paddingBottom: 16 }}>Dashboard</Title>
      {/* <Divider /> */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            title="Vaccinations Given"
            value={totalScheduled ?? 0}
            description="Scheduled appointments"
            icon={<Syringe />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            title="Appointment Requests"
            value={totalPending?? 0}
            description="Pending appointments"
            icon={<CalendarClock />}
            color="#fa8c16"
            onClick={() => router.push("/dashboard/appointments")}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            title="Daily Avg Vaccinations"
            value={dailyAvg}
            description="Average per day"
            icon={<Syringe />}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              minHeight: "300px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Upcoming Appointments</Title>
            <List
              dataSource={upcoming}
              pagination={{
                pageSize: 3,
                showSizeChanger: false,
              }}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/dashboard/patients/${item.user.id}`)}
                >
                  <List.Item.Meta
                    title={item.user.fullName}
                    description={`${item.scheduledDate} • ${item.scheduledTime} • ${item.vaccine.vaccineName}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No upcoming appointments" }}
            />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              minHeight: "300px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Vaccine Inventory Status</Title>
            <List
              dataSource={lowStocks}
              pagination={{
                pageSize: 3,
                showSizeChanger: false,
              }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.vaccine.vaccineName}
                    description={`Stock: ${item.stock}`}
                  />
                  <span style={{ color: "orange" }}>Low Stock</span>
                </List.Item>
              )}
              locale={{ emptyText: "No low stock vaccines" }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
