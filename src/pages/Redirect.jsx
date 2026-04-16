import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { resolveUrl } from "../services/urlService";

export default function Redirect() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug?.trim()) {
      setNotFound(true);
      return;
    }

    resolveUrl(slug)
      .then((data) => {
        console.log("Resolved URL data:", data);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <NotFound slug={slug} />;

  return <></>;
}

function NotFound({ slug }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-4">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-44 -right-44 h-[480px] w-[480px] rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -bottom-44 -left-44 h-[400px] w-[400px] rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 shadow-lg shadow-orange-200">
          <span className="text-2xl font-black text-white">?</span>
        </div>

        {/* Heading */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            404 — Not Found
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            Link doesn't exist
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-gray-400">
            {slug?.trim() ? (
              <>
                The short link{" "}
                <span className="font-mono font-semibold text-primary">
                  {slug}
                </span>{" "}
                may have expired or never existed.
              </>
            ) : (
              "No short code was provided in the URL."
            )}
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-xs rounded-2xl border border-orange-100 bg-white px-6 py-5"
          style={{
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(249,115,22,0.08)",
          }}
        >
          <p className="mb-4 text-sm text-gray-500">
            Create your own free short links with analytics and expiry control.
          </p>
          <Button
            type="primary"
            block
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            className="!rounded-xl !h-10 !font-semibold !shadow-sm !shadow-orange-200"
            onClick={() => navigate("/")}
          >
            Go to homepage
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
