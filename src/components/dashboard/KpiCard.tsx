import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string;
}

export default function KpiCard({
  title,
  value,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        cursor-pointer
      "
    >
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
    </motion.div>
  );
}