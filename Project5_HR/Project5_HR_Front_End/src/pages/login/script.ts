export async function verifyLogin(staffId: string, password: string): Promise<void> {
  const body = { staff_id: staffId, password };
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(result.message);
      window.location.href = "/dashboard";
    } 
    else {
      throw new Error(result.message || "Login failed");
    }

  } catch (err) {
    console.error("Error during login:", err);
  }
}
