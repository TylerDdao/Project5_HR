import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/navBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Account, Staff } from "../../data/type";
import { staffs as dummyStaffs } from "../../data/dummyData";
import { getCurrentDateTime } from "../../utils/time";

type ViewMode = "list" | "detail" | "add" | "update";

const EmployeeInfoPage: React.FC = () => {
  const [account, setAccount] = useState<Account | undefined>();
  const [currentStaff, setCurrentStaff] = useState<Staff | undefined>();

  const [view, setView] = useState<ViewMode>("list");
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<Staff | undefined>();

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  //  helpers for mixed field naming 
  const getId = (s: any) => s?.id ?? s?.staff_id;
  const getName = (s: any) => s?.name ?? "";
  const getPosition = (s: any) => s?.position ?? s?.role ?? "Employee";
  const getPhone = (s: any) =>
    s?.phone_number ?? s?.phoneNumber ?? s?.phone ?? "";
  const getHireDate = (s: any) =>
    s?.hire_date ?? s?.hireDate ?? s?.hire_date_str ?? "";

  const toDateInputValue = (d: any) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  //  auth + load initial data 
  useEffect(() => {
    // live clock header
    const t = setInterval(() => setCurrentDateTime(getCurrentDateTime()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const accountStr = sessionStorage.getItem("account");
    const staffStr = sessionStorage.getItem("staff");

    if (accountStr) {
      const parsedAccount = JSON.parse(accountStr) as Account;
      setAccount(parsedAccount);

      if (parsedAccount.role !== "Manager") {
        alert("You don't have permission to access this page");
        window.location.href = "/dashboard";
        return;
      }
    } else {
      alert("You are not logged in");
      window.location.href = "/dashboard";
      return;
    }

    if (staffStr) {
      const parsedStaff = JSON.parse(staffStr) as Staff;
      setCurrentStaff(parsedStaff);
    }

    // init employees from dummy data
    setEmployees(dummyStaffs);
  }, []);

  //  form state (shared by add/update) 
  const [formName, setFormName] = useState("");
  const [formPosition, setFormPosition] = useState("Employee");
  const [formPhone, setFormPhone] = useState("");
  const [formHireDate, setFormHireDate] = useState("");
  const [formStatus] = useState("Pending"); // per Figma, add defaults to pending

  const resetForm = () => {
    setFormName("");
    setFormPosition("Employee");
    setFormPhone("");
    setFormHireDate("");
  };

  const prefillFormFromSelected = (emp: Staff) => {
    setFormName(getName(emp));
    setFormPosition(getPosition(emp));
    setFormPhone(getPhone(emp));
    setFormHireDate(toDateInputValue(getHireDate(emp)));
  };

  //  navigation handlers 
  const openList = () => {
    setSelected(undefined);
    setView("list");
  };

  const openDetail = (emp: Staff) => {
    setSelected(emp);
    setView("detail");
  };

  const openAdd = () => {
    resetForm();
    setView("add");
  };

  const openUpdate = () => {
    if (!selected) return;
    prefillFormFromSelected(selected);
    setView("update");
  };

  //  CRUD handlers 
  const handleSaveNew = () => {
    if (!formName.trim()) {
      alert("Please enter employee name.");
      return;
    }

    const maxId =
      employees.reduce((mx, e) => Math.max(mx, Number(getId(e)) || 0), 0) || 0;

    const newEmp: any = {
      id: maxId + 1,
      name: formName.trim(),
      position: formPosition,
      phone_number: formPhone.trim(),
      hire_date: formHireDate ? new Date(formHireDate) : undefined,
      status: formStatus,
    };

    setEmployees((prev) => [...prev, newEmp]);
    openList();
  };

  const handleSaveUpdate = () => {
    if (!selected) return;
    if (!formName.trim()) {
      alert("Please enter employee name.");
      return;
    }

    const updated: any = {
      ...selected,
      name: formName.trim(),
      position: formPosition,
      phone_number: formPhone.trim(),
      hire_date: formHireDate ? new Date(formHireDate) : undefined,
    };

    setEmployees((prev) =>
      prev.map((e) => (getId(e) === getId(selected) ? updated : e))
    );
    setSelected(updated);
    setView("detail");
  };

  const handleDelete = () => {
    if (!selected) return;
    const ok = window.confirm("Delete this employee?");
    if (!ok) return;

    setEmployees((prev) =>
      prev.filter((e) => getId(e) !== getId(selected))
    );
    openList();
  };

  //  derived 
  const selectedDisplayId = selected ? `#${String(getId(selected)).padStart(3, "0")}` : "";

  //  UI blocks 
  const HeaderBar = (
    <>
      <h1>{currentDateTime}</h1>
      <div className="border border-charcoal w-[100px] my-[30px]"></div>
    </>
  );

  const EmployeeCard = ({ emp }: { emp: Staff }) => (
    <button
      onClick={() => openDetail(emp)}
      className="w-full text-left bg-white shadow rounded-[8px] p-3 hover:opacity-90"
    >
      <h3>Employee #{String(getId(emp)).padStart(3, "0")}</h3>
      <p>Name: {getName(emp)}</p>
      <p>Position: {getPosition(emp)}</p>
    </button>
  );

  //  RENDER 
  return (
    <div className="flex">
      <NavBar />

      <div className="flex flex-col ml-[400px] p-5 w-full">
        {HeaderBar}

        {/*  LIST VIEW  */}
        {view === "list" && (
          <div className="flex gap-10">
            {/* left: list */}
            <div className="flex-1 max-w-[520px] flex flex-col gap-3">
              <h2>Employee list</h2>
              {employees.map((emp) => (
                <EmployeeCard key={getId(emp)} emp={emp} />
              ))}
            </div>

            {/* right: management buttons */}
            <div className="flex flex-col gap-2">
              <h3>Employee management</h3>
              <div className="flex gap-2">
                <button
                  className="bg-accent_blue text-light_gray"
                  onClick={openAdd}
                >
                  <p>Add new employee</p>
                </button>
                <button
                  className="bg-light_gray text-accent_blue"
                  onClick={() => {
                    if (!selected) {
                      alert("Select an employee first.");
                      return;
                    }
                    openUpdate();
                  }}
                >
                  <p>Update employee information</p>
                </button>
              </div>
              <p className="caption text-medium_gray mt-2">
                Select an employee to update.
              </p>
            </div>
          </div>
        )}

        {/*  DETAIL VIEW  */}
        {view === "detail" && selected && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <button
              onClick={openList}
              className="text-light_gray bg-charcoal w-fit flex items-center gap-1"
            >
              <ArrowBackIcon /> Back
            </button>

            <div>
              <h2>Detail of Employee</h2>
              <div className="bg-white shadow rounded-[8px] p-3 w-fit mt-2">
                <h3>Employee {selectedDisplayId}</h3>
                <p>Name: {getName(selected)}</p>
                <p>Position: {getPosition(selected)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <p className="label">Employee Name</p>
                  <div className="bg-white shadow rounded-[6px] px-3 py-2 min-w-[220px]">
                    {getName(selected)}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="label">Phone Number</p>
                  <div className="bg-white shadow rounded-[6px] px-3 py-2 min-w-[220px]">
                    {getPhone(selected)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Position</p>
                <div className="bg-white shadow rounded-[6px] px-3 py-2 min-w-[220px]">
                  {getPosition(selected)}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Hire Date</p>
                <div className="bg-white shadow rounded-[6px] px-3 py-2 min-w-[220px]">
                  {extractFullDate(getHireDate(selected))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                className="bg-forest_green text-light_gray min-w-[90px]"
                onClick={openUpdate}
              >
                <p>Update</p>
              </button>
              <button
                className="bg-tomato_red text-light_gray min-w-[90px]"
                onClick={handleDelete}
              >
                <p>Delete</p>
              </button>
              <button className="bg-light_gray min-w-[90px]" onClick={openList}>
                <p>Cancel</p>
              </button>
            </div>
          </div>
        )}

        {/*  ADD VIEW  */}
        {view === "add" && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <button
              onClick={openList}
              className="text-light_gray bg-charcoal w-fit flex items-center gap-1"
            >
              <ArrowBackIcon /> Back
            </button>

            <div>
              <h2>Add new employee</h2>
              <div className="border border-charcoal w-[100px] my-[10px]"></div>
            </div>

            <div className="flex flex-col gap-4 w-fit">
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <p className="label">Name</p>
                  <input
                    className="w-[220px] h-[37px] bg-white"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Employee name"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="label">Status</p>
                  <div className="bg-light_gray text-charcoal shadow rounded-[6px] px-3 py-2 w-[220px] flex items-center gap-2">
                    <span className="caption bg-accent_blue text-light_gray px-2 py-1 rounded">
                      Pending
                    </span>
                    <span className="caption">
                      Employee status is pending by default
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Position</p>
                <select
                  className="w-[220px] h-[37px] bg-white shadow rounded-[8px] px-2"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Phone number</p>
                <input
                  className="w-[220px] h-[37px] bg-white"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 234-567-8901"
                />
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Hire date</p>
                <input
                  type="date"
                  className="w-[220px] h-[37px] bg-white"
                  value={formHireDate}
                  onChange={(e) => setFormHireDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                className="bg-forest_green text-light_gray min-w-[90px]"
                onClick={handleSaveNew}
              >
                <p>Save</p>
              </button>
              <button className="bg-light_gray min-w-[90px]" onClick={openList}>
                <p>Cancel</p>
              </button>
            </div>
          </div>
        )}

        {/*  UPDATE VIEW  */}
        {view === "update" && selected && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <button
              onClick={() => setView("detail")}
              className="text-light_gray bg-charcoal w-fit flex items-center gap-1"
            >
              <ArrowBackIcon /> Back
            </button>

            <div>
              <h2>Update Employee</h2>
              <div className="bg-white shadow rounded-[8px] p-3 w-fit mt-2">
                <h3>Employee {selectedDisplayId}</h3>
                <p>Name: {getName(selected)}</p>
                <p>Position: {getPosition(selected)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-fit">
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <p className="label">Employee Name</p>
                  <input
                    className="w-[220px] h-[37px] bg-white"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="label">Phone Number</p>
                  <input
                    className="w-[220px] h-[37px] bg-white"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Position</p>
                <select
                  className="w-[220px] h-[37px] bg-white shadow rounded-[8px] px-2"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-fit">
                <p className="label">Hire Date</p>
                <input
                  type="date"
                  className="w-[220px] h-[37px] bg-white"
                  value={formHireDate}
                  onChange={(e) => setFormHireDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                className="bg-forest_green text-light_gray min-w-[90px]"
                onClick={handleSaveUpdate}
              >
                <p>Save</p>
              </button>
              <button
                className="bg-tomato_red text-light_gray min-w-[90px]"
                onClick={handleDelete}
              >
                <p>Delete</p>
              </button>
              <button
                className="bg-light_gray min-w-[90px]"
                onClick={() => setView("detail")}
              >
                <p>Cancel</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfoPage;

// tiny local helper (keeps file self-contained)
function extractFullDate(d: any) {
  const date = d ? new Date(d) : new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

