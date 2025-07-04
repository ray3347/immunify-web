"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Input, Button, Card, Typography, Row, Col } from "antd";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Dayjs } from "dayjs";
import useAppointmentStore from "../../../../store/appointmentStore";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useActiveSession } from "../../../utilities/zustand";
import { appointmentStatusTypes } from "../../../constants/types";
import { IClinicAppointment } from "../../../interfaces/db/IAppointment";

const { Title, Text } = Typography;

// Helper: Convert "June 9, 2025" to YYYY-MM-DD
function toISODate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  // Pad month and day
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function VaccinationCalendar() {
  // const { appointments } = useAppointmentStore();
  const { activeAccount } = useActiveSession();
  const router = useRouter();

  // State for search and calendar navigation
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState<Dayjs | undefined>(undefined);
  const [filteredAppointments, setFilteredAppointments] = useState<
    IClinicAppointment[]
  >([]);

  useEffect(()=>{
    
    setFilteredAppointments(activeAccount?.clinic.scheduledAppointments ?? [])
    setLoading(true);
  },[])

  useEffect(()=>{
    if(activeAccount){

    console.log("filter2", activeAccount);
    const filter = activeAccount?.clinic.scheduledAppointments.filter(
      (apt) =>
        apt.status.toLowerCase() === appointmentStatusTypes.scheduled.toLowerCase());


    setFilteredAppointments(filter)
    setLoading(false);
    }
  },[activeAccount]);

  useEffect(() => {
    console.log("search", search);
    const filter = activeAccount?.clinic.scheduledAppointments.filter(
      (apt) =>
        apt.status.toLowerCase() === appointmentStatusTypes.scheduled.toLowerCase() &&
        (apt.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          apt.vaccine.vaccineName.toLowerCase().includes(search.toLowerCase()))
    );
    console.log("filter", filter);
    setFilteredAppointments(filter ?? []);
  }, [search]);

  // Filter appointments: only scheduled and match search
  // const filteredAppointments = activeAccount?.clinic.scheduledAppointments.filter(apt =>
  //   apt.status?.toLowerCase() === appointmentStatusTypes.scheduled &&
  //   (
  //     apt.user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
  //     apt.vaccine.vaccineName?.toLowerCase().includes(search.toLowerCase())
  //   )
  // );

  // Calendar cell renderer
  const dateCellRender = (value: Dayjs) => {
    console.log('render', value)
    const dateStr = value.format("YYYY-MM-DD");
    const listData = filteredAppointments?.filter((item) => {
      const isoDate = dayjs(item.scheduledDate).format("YYYY-MM-DD");
      console.log(
        `AAAAAAAAAA: isoDate = ${isoDate}, dateStr = ${dateStr}`
      );
      return isoDate === dateStr;
    });

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {listData?.map((item) => (
          <li key={item.id} style={{ marginBottom: "4px", cursor: "pointer" }}>
            <div
              style={{
                backgroundColor: "#fffbe7",
                padding: "2px 4px",
                borderRadius: "2px",
                fontSize: "12px",
                border: "1px solid #e0e0e0",
              }}
              onClick={() => router.push(`/dashboard/appointments/${item.id}`)}
            >
              <div style={{ fontWeight: 500 }}>{item.user.fullName}</div>
              <div>
                {item.vaccine.vaccineName} • {item.scheduledTime}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Calendar navigation
  const handlePanelChange = (date: Dayjs) => {
    setCurrentDate(date);
  };

  // Custom header with month navigation
  const headerTitle = ({
    value,
    onChange,
  }: {
    value: Dayjs | undefined;
    onChange: (date: Dayjs) => void;
  }) => {
    const safeValue = value || dayjs();
    const month = safeValue.format("MMMM YYYY");
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Vaccination Calendar
          </Title>
          <Text type="secondary">View and manage appointment schedule</Text>
        </div>
        <div className="flex items-center">
          <Button
            icon={<ChevronLeft size={16} />}
            type="text"
            aria-label="Previous month"
            onClick={() => onChange(safeValue.clone().subtract(1, "month"))}
          />
          <span className="mx-4 font-medium">{month}</span>
          <Button
            icon={<ChevronRight size={16} />}
            type="text"
            aria-label="Next month"
            onClick={() => onChange(safeValue.clone().add(1, "month"))}
          />
        </div>
      </div>
    );
  };

  return (
    <ClientOnly>
      {!activeAccount ? (
        <></>
      ) : (
        <Card className="w-full">
          <div className="pt-0 px-4 pb-4 border-b border-gray-200">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} lg={16}>
                <Calendar
                  value={currentDate}
                  headerRender={({ value, onChange }) =>
                    headerTitle({ value, onChange })
                  }
                  fullscreen={false}
                  style={{ display: "none" }}
                />
                {headerTitle({
                  value: currentDate,
                  onChange: setCurrentDate,
                })}
              </Col>
              <Col xs={24} lg={8}>
                <Input
                  placeholder="Search appointments..."
                  prefix={<Search size={16} />}
                  className="w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
            </Row>
          </div>

          <Calendar
            value={currentDate}
            cellRender={dateCellRender}
            mode="month"
            onPanelChange={handlePanelChange}
            headerRender={() => null}
          />
        </Card>
      )}
    </ClientOnly>
  );
}
