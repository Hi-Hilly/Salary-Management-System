import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_AUTH_DOMAIN",

  databaseURL: "YOUR_DATABASE_URL",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_STORAGE_BUCKET",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"
};

/* =========================
   FIREBASE INIT
========================= */

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

/* =========================
   LOGIN
========================= */

window.loginAdmin = function () {

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
};

window.openUserDashboard = function () {

  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("userDashboard")
    .classList.remove("hidden");
};

window.backToLogin = function () {

  document
    .getElementById("userDashboard")
    .classList.add("hidden");

    document
    .getElementById("loginPage")
    .classList.remove("hidden");
};

window.logoutAdmin = function () {

  document
    .getElementById("adminDashboard")
    .classList.add("hidden");

  document
    .getElementById("loginPage")
    .classList.remove("hidden");
};

/* =========================
   SECTION
========================= */

window.showSection = function (sectionId) {

  const sections =
    document.querySelectorAll(".dashboard-section");

  sections.forEach(section => {

    section.classList.add("hidden");
  });

  document
    .getElementById(sectionId)
    .classList.remove("hidden");
};

/* =========================
   SALARY
========================= */

function calculateSalary(hours, rate) {

  let overtime = 0;

  if (hours > 40) {

    overtime =
      (hours - 40) * (rate * 1.5);
  }

  let salary =
    (hours * rate) + overtime;

  salary =
    salary - (salary * 0.05);

  return salary;
}

/* =========================
   PRODUCTIVITY
========================= */

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

/* =========================
   ADD EMPLOYEE
========================= */

window.addEmployee = async function () {

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

  const employeeRef =
    push(ref(db, "employees"));

  await set(employeeRef, {

    id,
    name,
    hours,
    rate,
    role,
    salary
  });

  alert("Employee Added Successfully");

  clearForm();
};

/* =========================
   LOAD EMPLOYEES
========================= */

function loadEmployees() {

  const employeesRef =
    ref(db, "employees");

  onValue(employeesRef, (snapshot) => {

    const data = snapshot.val();

    const adminList =
      document.getElementById("adminEmployeeList");

    const userList =
      document.getElementById("userEmployeeList");

    if (adminList) {
      adminList.innerHTML = "";
    }

    if (userList) {
      userList.innerHTML = "";
    }

    if (!data) return;

    let salaries = [];

    for (let key in data) {

      const emp = data[key];

      salaries.push(emp.salary);

      const productivity =
        getProductivity(emp.hours);

      const userCard = `
        <div class="employee-card">

          <h3>${emp.name}</h3>

          <p><strong>ID:</strong> ${emp.id}</p>

          <p><strong>Role:</strong> ${emp.role}</p>

          <p><strong>Salary:</strong>
          ${emp.salary.toFixed(2)}</p>

          <p class="${productivity.className}">
            Productivity:
            ${productivity.text}
          </p>

        </div>
      `;

      const adminCard = `
        <div class="employee-card">

          <h3>${emp.name}</h3>

          <p><strong>ID:</strong> ${emp.id}</p>

          <p><strong>Role:</strong> ${emp.role}</p>

          <p><strong>Hours:</strong> ${emp.hours}</p>

          <p><strong>Rate:</strong> ${emp.rate}</p>

          <p><strong>Salary:</strong>
          ${emp.salary.toFixed(2)}</p>

          <button
            class="delete-btn"
            onclick="deleteEmployee('${key}')">

            Delete Employee

          </button>

        </div>
      `;

      if (adminList) {
        adminList.innerHTML += adminCard;
      }

      if (userList) {
        userList.innerHTML += userCard;
      }
    }

    updateStatistics(salaries);
  });
}

/* =========================
   DELETE EMPLOYEE
========================= */

window.deleteEmployee =
async function (key) {

  const confirmDelete =
    confirm("Delete employee?");

  if (confirmDelete) {

    await remove(
      ref(db, `employees/${key}`)
    );
  }
};

/* =========================
   SEARCH EMPLOYEE
========================= */

window.searchEmployee = function () {

  const searchId =
    document.getElementById("searchId").value;

  const employeesRef =
    ref(db, "employees");

  onValue(employeesRef, (snapshot) => {

    const data = snapshot.val();

    let found = false;

    for (let key in data) {

      const emp = data[key];

      if (emp.id == searchId) {

        found = true;

        alert(
          `Employee Found\n\n` +
          `Name: ${emp.name}\n` +
          `Role: ${emp.role}\n` +
          `Salary: ${emp.salary.toFixed(2)}`
        );
      }
    }

    if (!found) {

      alert("Employee Not Found");
    }

  }, {
    onlyOnce: true
  });
};

/* =========================
   STATISTICS
========================= */

function updateStatistics(salaries) {

  if (salaries.length === 0) {

    document.getElementById("highestSalary")
      .innerText = "0";

    document.getElementById("lowestSalary")
      .innerText = "0";

    document.getElementById("averageSalary")
      .innerText = "0";

    return;
  }

  const highest =
    Math.max(...salaries);

  const lowest =
    Math.min(...salaries);

  const average =
    salaries.reduce((a, b) => a + b, 0)
    / salaries.length;

  document.getElementById("highestSalary")
    .innerText = highest.toFixed(2);

  document.getElementById("lowestSalary")
    .innerText = lowest.toFixed(2);

  document.getElementById("averageSalary")
    .innerText = average.toFixed(2);
}

/* =========================
   CLEAR FORM
========================= */

function clearForm() {

  document.getElementById("id").value = "";

  document.getElementById("name").value = "";

  document.getElementById("hours").value = "";

  document.getElementById("rate").value = "";
}

/* =========================
   INITIAL LOAD
========================= */

loadEmployees();
