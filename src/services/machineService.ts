export async function getMachines() {
  const token = localStorage.getItem(
    "agrocontrol_token",
  );

  const response = await fetch(
    "http://localhost:4000/machines",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener maquinaria",
    );
  }

  return response.json();
}