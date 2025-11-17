export async function verifyLogin(staffId: string, password: string): Promise<void> {
  const body = { staff_id: staffId, password };
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      sessionStorage.setItem("token", result.token);
      // sessionStorage.setItem("name", result.staff.name);
      // sessionStorage.setItem("staff_id", result.staff.id);
      // sessionStorage.setItem("hire_date", result.staff.hire_date);
      // sessionStorage.setItem("phone_num", result.staff.phone_number);

      // sessionStorage.setItem("account_id", result.account.id);
      // sessionStorage.setItem("role", result.account.role);

      sessionStorage.setItem("staff", JSON.stringify(result.staff));

      // Save the account object
      sessionStorage.setItem("account", JSON.stringify(result.account));
      window.location.href = "/dashboard";
    } 
    else {
      alert("Login failed")
      throw new Error(result.message || "Login failed");
    }

  } catch (err) {
    console.error("Error during login:", err);
  }
}
