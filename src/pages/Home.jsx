import { useState } from "react";
import { Button, Input, Typography, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { LinkOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { showToast } from "../lib/toast";

const { Title, Text } = Typography;

const DEMO_SHORT_URL = "https://short.ly/abc123";
const EXPIRY_PRESETS = ["1 Hour", "24 Hours", "7 Days"];

export default function Home() {
  const [url, setUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [expiryPreset, setExpiryPreset] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePreset = (preset) => {
    setExpiryPreset((prev) => (prev === preset ? null : preset));
    setExpiryDate(null);
    setExpiryTime(null);
  };

  const isToday = (date) => date && date.isSame(dayjs(), "day");

  const disabledDate = (current) => current && current.isBefore(dayjs().startOf("day"));

  const disabledTime = () => {
    if (!isToday(expiryDate)) return {};
    const now = dayjs();
    const currentHour = now.hour();
    const currentMinute = now.minute();
    return {
      disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
      disabledMinutes: (selectedHour) =>
        selectedHour === currentHour
          ? Array.from({ length: currentMinute + 1 }, (_, i) => i)
          : [],
    };
  };

  const handleDateChange = (date) => {
    setExpiryDate(date);
    setExpiryPreset(null);
    // clear time if it's now in the past due to date change
    if (date && date.isSame(dayjs(), "day") && expiryTime) {
      const now = dayjs();
      if (expiryTime.isBefore(now, "minute")) setExpiryTime(null);
    }
  };

  const handleTimeChange = (time) => {
    setExpiryTime(time);
    setExpiryPreset(null);
  };

  const handleGenerate = () => {
    if (!url.trim()) return;

    if (!url.includes(".com")) {
      showToast.error("Invalid URL — must contain a valid domain (e.g. .com)");
      setShortUrl(null);
      return;
    }

    setLoading(true);
    setShortUrl(null);
    setTimeout(() => {
      setShortUrl(DEMO_SHORT_URL);
      setLoading(false);
      showToast.success("Your URL has been shortened successfully!");
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    showToast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 flex flex-1 items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <LinkOutlined className="text-primary text-2xl" />
          <Title level={3} className="!mb-0">
            URL Shortener
          </Title>
        </div>

        <div className="flex flex-col gap-4">
          {/* Long URL */}
          <Input
            size="large"
            placeholder="Enter long URL *"
            className="rounded-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPressEnter={handleGenerate}
          />

          {/* Custom short name */}
          <Input
            size="large"
            placeholder="Custom short name (optional)"
            className="rounded-lg"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />

          {/* Expiration */}
          <div className="flex flex-col gap-2">
            <Text type="secondary" className="text-sm">
              Expiration (optional)
            </Text>

            {/* Preset buttons */}
            <div className="flex gap-2">
              {EXPIRY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer ${
                    expiryPreset === preset
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Date & Time pickers */}
            <div className="flex gap-2 my-1">
              <DatePicker
                className="flex-1"
                placeholder="mm/dd/yyyy"
                format="MM/DD/YYYY"
                value={expiryDate}
                onChange={handleDateChange}
                disabledDate={disabledDate}
              />
              <TimePicker
                className="flex-1"
                placeholder="-- : -- --"
                use12Hours
                format="h:mm a"
                value={expiryTime}
                onChange={handleTimeChange}
                disabledTime={disabledTime}
                showNow={false}
              />
            </div>
          </div>

          {/* CTA */}
          <Button
            type="primary"
            size="large"
            block
            className="rounded-lg"
            loading={loading}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>

        {/* Result */}
        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <Text type="secondary" className="text-xs uppercase tracking-wide">
              Shortened URL
            </Text>
            <div className="flex items-center gap-2 mt-1">
              <Text className="text-primary font-medium flex-1 truncate">
                {shortUrl}
              </Text>
              <Button
                size="small"
                type="primary"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
