"use client";

import React from "react";
import { Typography, Row, Col, Divider, List, Button } from "antd";
import { Syringe, CalendarClock } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { useRouter } from "next/navigation";
import useAppointmentStore from "../../../store/appointmentStore";
import useVaccineInventoryStore from "../../../store/vaccineInventoryStore";

const { Title } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { appointments } = useAppointmentStore();
  const { vaccines, stocks } = useVaccineInventoryStore();

  // Data summary
  const totalScheduled = appointments.filter((a) => a.status === "Scheduled").length;
  const totalPending = appointments.filter((a) => a.status === "Pending").length;

  // Daily avg (dummy: total scheduled / unique date count)
  const uniqueDates = [
    ...new Set(appointments.filter((a) => a.status === "Scheduled").map((a) => a.preferredDate)),
  ];
  const dailyAvg = uniqueDates.length > 0 ? Math.round(totalScheduled / uniqueDates.length) : 0;

  // Upcoming appointments (ambil 5 terdekat, hanya status scheduled, urutkan by date)
  const upcoming = appointments
    .filter((a) => a.status === "Scheduled")
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())
    .slice(0, 5);

  // Low stock vaccines (stock ≤ 3)
  const lowStocks = stocks
    .filter((s) => s.quantity <= 3)
    .map((s) => ({
      ...s,
      vaccine: vaccines.find((v) => v.id === s.vaccineId),
    }))
    .filter((s) => s.vaccine);

  return (
    <div>
      <Title level={3} style={{ margin: 0, paddingBottom: 16 }}>Dashboard</Title>
      {/* <Divider /> */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            title="Vaccinations Given"
            value={totalScheduled}
            description="Completed appointments"
            icon={<Syringe />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <DashboardCard
            title="Appointment Requests"
            value={totalPending}
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
                  onClick={() => router.push(`/dashboard/patients/${item.patientId}`)}
                >
                  <List.Item.Meta
                    title={item.patientName}
                    description={`${item.preferredDate} • ${item.preferredTime} • ${item.vaccineType}`}
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
                    title={item.vaccine?.name}
                    description={`Stock: ${item.quantity}`}
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
