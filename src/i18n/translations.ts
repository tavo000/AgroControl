export const translations = {
  es: {
    alerts: {
      title: "Centro de Alertas",
      subtitle:
        "Monitoreo de incidentes operativos por maquinaria, sensores y telemetría.",
      openAlerts: "Alertas abiertas",
      totalAlerts: "Total de alertas",
      criticalOpen: "Críticas abiertas",
      filters: "Filtros",
      filterBySeverity:
        "Filtra alertas por severidad.",
      history: "Historial de alertas",
      historySubtitle:
        "Eventos detectados automáticamente por el sistema IoT.",
      all: "Todas",
      low: "Baja",
      medium: "Media",
      high: "Alta",
      critical: "Crítica",
      machine: "Maquinaria",
      type: "Tipo",
      severity: "Severidad",
      status: "Estado",
      message: "Mensaje",
      actions: "Acciones",
      resolved: "Resuelta",
      open: "Abierta",
      resolve: "Resolver",
      noAlerts:
        "No hay alertas para el filtro seleccionado.",
      lowFuel: "Combustible bajo",
      highTemperature:
        "Temperatura elevada",
      highSpeed: "Velocidad elevada",
      offline: "Sin conexión",
    },
  },

  en: {
    alerts: {
      title: "Alerts Center",
      subtitle:
        "Monitoring of operational incidents from machinery, sensors and telemetry.",
      openAlerts: "Open alerts",
      totalAlerts: "Total alerts",
      criticalOpen: "Open critical alerts",
      filters: "Filters",
      filterBySeverity:
        "Filter alerts by severity.",
      history: "Alerts history",
      historySubtitle:
        "Events automatically detected by the IoT system.",
      all: "All",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
      machine: "Machine",
      type: "Type",
      severity: "Severity",
      status: "Status",
      message: "Message",
      actions: "Actions",
      resolved: "Resolved",
      open: "Open",
      resolve: "Resolve",
      noAlerts:
        "No alerts for the selected filter.",
      lowFuel: "Low fuel",
      highTemperature:
        "High temperature",
      highSpeed: "High speed",
      offline: "Offline",
    },
  },
};

export type Language = keyof typeof translations;