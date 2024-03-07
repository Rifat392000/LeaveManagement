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

function fetchLeaveRecords() {
    fetch(`/leaveRecordsM?empId=${currentUser.empId}&status=2`)
        .then(response => response.json())
        .then(data => {
            // Update the table body with leave records
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            data.leaveRecords.forEach(record => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = record.Lid;
                row.insertCell().textContent = record.emp;
                row.insertCell().textContent = record.empName;
                if(record.leaveTypeId === 1){
                    row.insertCell().textContent = 'Personal';
                }
                else if(record.leaveTypeId === 2){
                    row.insertCell().textContent = 'Sick';
                }
                else if(record.leaveTypeId === 3){
                    row.insertCell().textContent = 'Casual';
                }
                row.insertCell().textContent = formatDate(record.fromDate);
                row.insertCell().textContent = formatDate(record.toDate);
                row.insertCell().textContent = record.days;
                row.insertCell().textContent = record.reason;

                 const statusCell = row.insertCell();
                const statusSpan = document.createElement('span'); // Create <span> element
                if (record.status === 2) {
                    statusSpan.textContent = 'Rejected';
                    statusSpan.classList.add('rejected'); // Add class for styling
                } 
                statusCell.appendChild(statusSpan); 
               
            });

            function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            }

        })
        .catch(error => console.error('Error fetching leave records:', error));
}

// Function to approve leave

fetchLeaveRecords();


document.getElementById('refresh').addEventListener('click', () =>{
    window.location.href = "reject.html";
})


document.getElementById('mr').addEventListener('click', () =>{
    window.location.href = "manage.html";
})

document.getElementById('ar').addEventListener('click', () =>{
    window.location.href = "approve.html";
})


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
