const TAX = 0.05;

let employees = [];

/* ======================
   LOGIN SYSTEM
====================== */

function loginAdmin() {

  const password =
    document.getElementById("adminPassword").value;

  if (password === "admin123") {

    document
      .getElementById("loginPage")
      .classList.add("hidden");

    document
      .getElementById("adminDashboard")
      .classList.remove("hidden");
  }
  else {

    alert("Wrong Password");
  }
}

function openUserDashboard() {

  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("userDashboard")
    .classList.remove("hidden");

  displayEmployees();
}

function backToLogin() {

  document
    .getElementById("userDashboard")
    .classList.add("hidden");

  document
    .getElementById("loginPage")
    .classList.remove("hidden");
}

function logoutAdmin() {

  document
    .getElementById("adminDashboard")
    .classList.add("hidden");

  document
    .getElementById("loginPage")
    .classList.remove("hidden");
}

/* ======================
   SECTION CONTROL
====================== */

function showSection(sectionId) {

  const sections =
    document.querySelectorAll(".dashboard-section");

  sections.forEach(section => {

    section.classList.add("hidden");
  });

  document
    .getElementById(sectionId)
    .classList.remove("hidden");
}

/* ======================
   SALARY
====================== */

function calculateSalary(hours, rate) {

  let overtime = 0;

  if (hours > 40) {

    overtime =
      (hours - 40) * (rate * 1.5);
  }

  let salary =
    (hours * rate) + overtime;

  salary =
    salary - (salary * TAX);

  return salary;
}

/* ======================
   PRODUCTIVITY
====================== */

function getProductivity(hours) {

  if (hours >= 60) {
    return {
      text: "Very High",
      className: "veryhigh"
    };
  }
  else if (hours >= 40) {
    return {
      text: "High",
      className: "high"
    };
  }
  else {
    return {
      text: "Normal",
      className: "normal"
    };
  }
}

/* ======================
   ADD EMPLOYEE
====================== */

function addEmployee() {

  const id =
    document.getElementById("id").value;

  const name =
    document.getElementById("name").value;

  const hours =
    parseInt(document.getElementById("hours").value);

  const rate =
    parseFloat(document.getElementById("rate").value);

  const role =
    document.getElementById("role").value;

  if (!id || !name || !hours || !rate) {

    alert("Please fill all fields");

    return;
  }

  const salary =
    calculateSalary(hours, rate);

  employees.push({
    id,
    name,
    hours,
    rate,
    role,
    salary
  });

  displayEmployees();

  updateStatistics();

  clearForm();

  alert("Employee Added Successfully");
}

/* ======================
   DISPLAY EMPLOYEES
====================== */

function displayEmployees() {

  const adminList =
    document.getElementById("adminEmployeeList");

  const userList =
    document.getElementById("userEmployeeList");

  adminList.innerHTML = "";

  userList.innerHTML = "";

  employees.forEach((emp, index) => {

    const productivity =
      getProductivity(emp.hours);

    const card = `
      <div class="employee-card">

        <h3>${emp.name}</h3>

        <p><strong>ID:</strong> ${emp.id}</p>

        <p><strong>Role:</strong> ${emp.role}</p>

        <p><strong>Hours:</strong> ${emp.hours}</p>

        <p><strong>Salary:</strong> ${emp.salary.toFixed(2)}</p>

        <p class="${productivity.className}">
          Productivity: ${productivity.text}
        </p>

      </div>
    `;

    userList.innerHTML += card;

    adminList.innerHTML += `
      <div class="employee-card">

        <h3>${emp.name}</h3>

        <p><strong>ID:</strong> ${emp.id}</p>

        <p><strong>Role:</strong> ${emp.role}</p>

        <p><strong>Hours:</strong> ${emp.hours}</p>

        <p><strong>Rate:</strong> ${emp.rate}</p>

        <p><strong>Salary:</strong> ${emp.salary.toFixed(2)}</p>

        <button 
          class="delete-btn"
          onclick="deleteEmployee(${index})">
          Delete Employee
        </button>

      </div>
    `;
  });
}

/* ======================
   DELETE EMPLOYEE
====================== */

function deleteEmployee(index) {

  const confirmDelete =
    confirm("Delete employee?");

  if (confirmDelete) {

    employees.splice(index, 1);

    displayEmployees();

    updateStatistics();
  }
}

/* ======================
   SEARCH EMPLOYEE
====================== */

function searchEmployee() {

  const searchId =
    document.getElementById("searchId").value;

  const employee =
    employees.find(emp => emp.id == searchId);

  if (employee) {

    alert(
      `Employee Found\n\n` +
      `Name: ${employee.name}\n` +
      `Role: ${employee.role}\n` +
      `Salary: ${employee.salary.toFixed(2)}`
    );
  }
  else {

    alert("Employee Not Found");
  }
}

/* ======================
   STATISTICS
====================== */

function updateStatistics() {

  if (employees.length === 0) {

    document.getElementById("highestSalary").innerText = 0;

    document.getElementById("lowestSalary").innerText = 0;

    document.getElementById("averageSalary").innerText = 0;

    return;
  }

  let highest = employees[0].salary;

  let lowest = employees[0].salary;

  let total = 0;

  employees.forEach(emp => {

    if (emp.salary > highest) {
      highest = emp.salary;
    }

    if (emp.salary < lowest) {
      lowest = emp.salary;
    }

    total += emp.salary;
  });

  const average =
    total / employees.length;

  document.getElementById("highestSalary")
    .innerText = highest.toFixed(2);

  document.getElementById("lowestSalary")
    .innerText = lowest.toFixed(2);

  document.getElementById("averageSalary")
    .innerText = average.toFixed(2);
}

/* ======================
   CLEAR FORM
====================== */

function clearForm() {

  document.getElementById("id").value = "";

  document.getElementById("name").value = "";

  document.getElementById("hours").value = "";

  document.getElementById("rate").value = "";
}
