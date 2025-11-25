import { useEffect, useState } from "react";

const LocalTime = ({
  label = "samarinda, id",
  timeZone = "Asia/Makassar",
  className = "",
  timeClassName = "",
}) => {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const updateTime = () => setLocalTime(formatter.format(new Date()).toLowerCase());
    updateTime();
    const id = setInterval(updateTime, 30 * 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="tracking-tight">{label}</span>
      <span className={`text-xl${timeClassName}`}>{localTime || "--:--"}</span>
    </div>
  );
};

export default LocalTime;
