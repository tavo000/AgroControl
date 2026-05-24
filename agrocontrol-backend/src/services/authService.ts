interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(
  payload: LoginPayload,
) {
  const response = await fetch(
    "http://localhost:4000/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Credenciales incorrectas",
    );
  }

  return response.json();
}