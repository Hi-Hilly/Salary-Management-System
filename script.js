const TAX = 0.05;

const ADMIN_PASSWORD = "adminftuisthub";

let employees = [];

// =========================
// DASHBOARD MODE
// =========================

function showUserDashboard() {

    document.getElementById("userDashboard").style.display = "block";

    document.getElementById("adminDashboard").style.display = "none";
}

function adminLogin() {

    const password = prompt("Enter Admin Password");

    if (password === ADMIN_PASSWORD) {

        document.getElementById("adminDashboard").style.display = "block";

        document.getElementById("userDashboard").style.display = "none";
    }
    else {
        alert("Wrong Password");
    }
}

// =========================
// CALCULATE SALARY
// =========================

function calculateSalary(hours, rate) {

    let overtime = 0;

    if (hours > 40) {
        overtime = (hours - 40) * (rate * 1.5);
    }

    let salary = (hours * rate) + overtime;

    salary = salary - (salary * TAX);

    return salary;
}

// =========================
// PRODUCTIVITY
// =========================

function getProductivity(hours) {

    if (hours >= 60) {
        return {
            text: "Very High",
            className: "productivity-veryhigh"
        };
    }
    else if (hours >= 40) {
        return {
            text: "High",
            className: "productivity-high"
        };
    }
    else {
        return {
            text: "Normal",
            className: "productivity-normal"
        };
    }
}

// =========================
// ADD EMPLOYEE
// =========================

function addEmployee() {

    const id = document.getElementById("id").value;

    const name = document.getElementById("name").value;

    const hours = parseInt(document.getElementById("hours").value);

    const rate = parseFloat(document.getElementById("rate").value);

    const role = document.getElementById("role").value;

    if (!id || !name || !hours || !rate) {
        alert("Please Fill All Fields");
        return;
    }

    const salary = calculateSalary(hours, rate);

    const employee = {
        id,
        name,
        hours,
        rate,
        salary,
        role
    };

    employees.push(employee);

    displayEmployees();

    clearForm();

    alert("Employee Added Successfully");
}

// =========================
// DISPLAY EMPLOYEE
// =========================

function displayEmployees() {

    const employeeList = document.getElementById("employeeList");

    employeeList.innerHTML = "";

    employees.forEach((emp, index) => {

        const productivity = getProductivity(emp.hours);

        employeeList.innerHTML += `
    
      <div class="employee-card">

        <h3>Employee ${index + 1}</h3>

        <p><strong>ID:</strong> ${emp.id}</p>

        <p><strong>Name:</strong> ${emp.name}</p>

        <p><strong>Hours:</strong> ${emp.hours}</p>

        <p><strong>Rate:</strong> ${emp.rate}</p>

        <p><strong>Salary:</strong> ${emp.salary.toFixed(2)}</p>

        <p><strong>Role:</strong> ${emp.role}</p>

        <p class="${productivity.className}">
          Productivity: ${productivity.text}
        </p>

      </div>
    `;
    });
}

// =========================
// SEARCH EMPLOYEE
// =========================

function searchEmployee() {

    const searchId = document.getElementById("searchId").value;

    const employee = employees.find(emp => emp.id == searchId);

    const result = document.getElementById("searchResult");

    if (employee) {

        result.innerHTML = `
      <div class="employee-card">

        <h3>Employee Found</h3>

        <p><strong>Name:</strong> ${employee.name}</p>

        <p><strong>Salary:</strong> ${employee.salary.toFixed(2)}</p>

        <p><strong>Role:</strong> ${employee.role}</p>

      </div>
    `;
    }
    else {

        result.innerHTML = `
      <div class="employee-card">
        Employee Not Found
      </div>
    `;
    }
}

// =========================
// STATISTICS
// =========================

function showStatistics() {

    if (employees.length === 0) {

        alert("No Data Available");

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

    const average = total / employees.length;

    document.getElementById("statisticsResult").innerHTML = `
  
    <p>Highest Salary : ${highest.toFixed(2)}</p>

    <p>Lowest Salary : ${lowest.toFixed(2)}</p>

    <p>Average Salary : ${average.toFixed(2)}</p>
  `;
}

// =========================
// CLEAR FORM
// =========================

function clearForm() {

    document.getElementById("id").value = "";

    document.getElementById("name").value = "";

    document.getElementById("hours").value = "";

    document.getElementById("rate").value = "";
}

// =========================
// INITIAL DISPLAY
// =========================

displayEmployees();
