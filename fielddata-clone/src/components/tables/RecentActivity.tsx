const activities = [
  {
    machine: "Tractor A12",
    status: "Activo",
    hours: "12 h",
  },
  {
    machine: "Cosechadora B7",
    status: "En mantenimiento",
    hours: "4 h",
  },
  {
    machine: "Pulverizadora X5",
    status: "Activo",
    hours: "9 h",
  },
];

export default function RecentActivity() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Actividad reciente
      </h2>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.machine}
            className="
              flex
              justify-between
              items-center
              bg-slate-800
              rounded-xl
              p-4
            "
          >
            <div>
              <p className="font-medium">
                {item.machine}
              </p>

              <p className="text-sm text-slate-400">
                {item.status}
              </p>
            </div>

            <span className="text-emerald-400">
              {item.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}