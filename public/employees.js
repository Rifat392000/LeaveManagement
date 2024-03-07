// Retrieve user information from sessionStorage
const currentUserJSON = sessionStorage.getItem('currentUser');
const currentUser = JSON.parse(currentUserJSON);

if (currentUser) {
    document.querySelectorAll('.empName').forEach(element => {
        element.innerText = currentUser.empName;
    });

    document.querySelectorAll('.empId').forEach(element => {
        element.innerText = currentUser.empId;
    });

    
    const imgElement = document.querySelectorAll('.empImg');

    if (currentUser.empId === 1001) {
        imgElement.forEach(img => {
            img.src = 'rifat.png';
        });
       
    } else if (currentUser.empId === 1002) {
        imgElement.forEach(img => {
            img.src = 'niaz.png';
        });
    } else if (currentUser.empId === 1003) {
        imgElement.forEach(img => {
            img.src = 'lee.png';
        });
    } else if (currentUser.empId === 1004) {
        imgElement.forEach(img => {
            img.src = 'oly.png';
        });
    } else if (currentUser.empId === 1005) {
        imgElement.forEach(img => {
            img.src = 'bilash.png';
        });
    }
} else {
    alert('User information not found. Please log in.');
    window.location.href = 'index.html';
}





document.getElementById('log_out').addEventListener('click', () => {
    // Remove user from session storage
    sessionStorage.removeItem('currentUser');

    window.location.href = 'index.html';

    // Manipulate the browser's history to prevent going back
    history.pushState(null, null, 'index.html');
});

// Disable the back button functionality
window.onpopstate = function(event) {
    history.pushState(null, null, 'index.html');
};




document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the server endpoint
    fetch('/employees')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateEmployeeTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function updateEmployeeTable(data) {
        // Assuming you have an HTML table with the id 'employeeTable'
        const table = document.getElementById('employeeTable');

        // Clear existing table content, except for the header
        table.querySelector('tbody').innerHTML = '';

        // Create table rows with data
        data.forEach((employee, index) => {
            const row = table.querySelector('tbody').insertRow(index);
            const columns = ['empId', 'empName', 'employeeDesignation', 'supervisorName'];

            columns.forEach((column, columnIndex) => {
                const cell = row.insertCell(columnIndex);
                if (column === 'supervisorName' && employee[column] === null) {
                    cell.textContent = 'Not Applicable';
                    cell.style.color = 'red';  // Set text color to red
                } else {
                    cell.textContent = employee[column];
                }
            });
        });
    }
});

  