import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import {
  LinkOutlined,
  CopyOutlined,
  CheckOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { showToast } from "../lib/toast";
import { getExpirySeconds } from "../lib/utils";
import { shortenUrl } from "../services/urlService";
const EXPIRY_PRESETS = ["1 Hour", "24 Hours", "7 Days"];

const STATS = [
  { icon: ThunderboltOutlined, value: "10M+", label: "Links Shortened" },
  { icon: SafetyOutlined, value: "99.9%", label: "Uptime" },
  { icon: BarChartOutlined, value: "500M+", label: "Clicks Tracked" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

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

  const disabledDate = (current) =>
    current && current.isBefore(dayjs().startOf("day"));

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
    if (date && date.isSame(dayjs(), "day") && expiryTime) {
      if (expiryTime.isBefore(dayjs(), "minute")) setExpiryTime(null);
    }
  };

  const handleTimeChange = (time) => {
    setExpiryTime(time);
    setExpiryPreset(null);
  };

  const handleGenerate = async () => {
    if (!url.trim()) return;
    if (!url.includes(".")) {
      showToast.error("Invalid URL — must contain a valid domain");
      setShortUrl(null);
      return;
    }

    const expirySeconds = getExpirySeconds({
      expiryPreset,
      expiryDate,
      expiryTime,
    });

    setLoading(true);
    setShortUrl(null);
    try {
      const data = await shortenUrl({
        url: url.trim(),
        expiry_seconds: expirySeconds || undefined,
        short_code: customName.trim() || undefined,
      });
      console.log("Shortened URL data:", data);
      setShortUrl(
        `${window.location.origin}/${import.meta.env.VITE_SHORT_URL_PREFIX}/${data.short_code}`,
      );
      showToast.success("Your URL has been shortened successfully!");
    } catch (err) {
      showToast.error(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    showToast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-orange-50 px-4 py-14">
      {/* ── Decorative background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -top-44 -right-44 h-[480px] w-[480px] rounded-full bg-orange-300/25 blur-3xl" />
        <div className="animate-float-delayed absolute -bottom-44 -left-44 h-[400px] w-[400px] rounded-full bg-amber-300/20 blur-3xl" />
        <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/8 blur-2xl" />
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#F97316 1px, transparent 1px), linear-gradient(90deg, #F97316 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Hero text ── */}
      <motion.div className="relative z-10 mb-10 text-center" {...fadeUp(0)}>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          Short links,{" "}
          <span
            className="bg-gradient-to-r from-primary via-orange-400 to-amber-400 bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text" }}
          >
            big impact
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-gray-500 sm:text-md">
          Create branded short URLs with custom names, expiry dates, and click
          analytics — in seconds.
        </p>
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8"
        {...fadeUp(0.12)}
      >
        {/* Card header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg shadow-orange-200">
            <LinkOutlined className="text-lg" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              URL Shortener
            </p>
            <p className="text-xs font-semibold text-gray-700 leading-none mt-1.5">
              Paste your long link below
            </p>
          </div>
        </div>

        {/* ── Result (above inputs) ── */}
        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              {/* padding gives shadow room inside the overflow:hidden boundary */}
              <div style={{ padding: "4px 4px 16px 4px" }}>
              <div
                className="rounded-2xl bg-white px-4 py-3 border border-orange-200"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(249,115,22,0.12)" }}
              >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckOutlined className="text-[10px] text-green-600" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-green-600">
                      Ready to share
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate font-mono text-sm font-bold text-primary hover:underline"
                    >
                      {shortUrl}
                    </a>
                    <motion.div whileTap={{ scale: 0.93 }}>
                      <Button
                        size="small"
                        type={copied ? "default" : "primary"}
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={handleCopy}
                        className={`!rounded-lg !font-semibold transition-all ${
                          copied
                            ? "!border-green-300 !text-green-600 !bg-green-50"
                            : "!shadow-sm !shadow-orange-200"
                        }`}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>{/* padding wrapper */}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          {/* Long URL */}
          <Input
            size="large"
            placeholder="https://your-very-long-url.com/..."
            className="rounded-xl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPressEnter={handleGenerate}
            prefix={<LinkOutlined className="text-gray-300" />}
          />

          {/* Custom short name */}
          <Input
            size="large"
            placeholder="Custom short name (optional)"
            className="rounded-xl"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            prefix={
              <span className="text-xs font-mono text-gray-400 select-none">
                {import.meta.env.VITE_SHORT_URL_PREFIX}/
              </span>
            }
          />

          {/* Expiration */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Expiration{" "}
              <span className="normal-case font-normal">(optional)</span>
            </p>

            {/* Preset pills */}
            <div className="flex gap-2">
              {EXPIRY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    expiryPreset === preset
                      ? "bg-primary text-white border-primary shadow-sm shadow-orange-200"
                      : "bg-white/60 text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Date & Time pickers */}
            <div className="flex gap-2">
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
            className="!rounded-xl !h-11 !font-semibold !shadow-md !shadow-orange-200"
            loading={loading}
            onClick={handleGenerate}
            icon={!loading && <ArrowRightOutlined />}
            iconPosition="end"
          >
            {loading ? "Shortening…" : "Generate Short URL"}
          </Button>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        className="relative z-10 mt-10 flex items-center gap-8 sm:gap-14"
        {...fadeUp(0.24)}
      >
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-primary text-base">
              <Icon />
            </div>
            <span className="text-lg font-bold text-gray-800">{value}</span>
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
