import React from "react";
import { Avatar } from "antd";

interface PatientAvatarProps {
  name: string;
}

function getInitials(name: string) {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

const PatientAvatar: React.FC<PatientAvatarProps> = ({ name }) => (
  <Avatar
    style={{
      backgroundColor: stringToColor(name),
      verticalAlign: "middle",
      fontWeight: 500,
    }}
    size={32}
  >
    {getInitials(name)}
  </Avatar>
);

export default PatientAvatar;