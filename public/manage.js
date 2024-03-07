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
    fetch(`/leaveRecordsM?empId=${currentUser.empId}`)
        .then(response => response.json())
        .then(data => {
            // Update the table body with leave records
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            data.leaveRecords.forEach(record => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = record.Lid;
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
                if (record.status === 0) {
                    statusSpan.textContent = 'Pending';
                    statusSpan.classList.add('pending'); // Add class for styling
                } 
                statusCell.appendChild(statusSpan); 
                // Action buttons for approving or rejecting leave
                const actionCell = row.insertCell();
                const approveButton = document.createElement('button');
                approveButton.id = 'approveButton'; 
                approveButton.textContent = 'Approve';
                approveButton.addEventListener('click', () => approveLeave(record.Lid));
                actionCell.appendChild(approveButton);

                const rejectButton = document.createElement('button');
                rejectButton.id = 'rejectButton';
                rejectButton.textContent = 'Reject';
                rejectButton.addEventListener('click', () => rejectLeave(record.Lid));
                actionCell.appendChild(rejectButton);
            });

            function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            }

            // Update aggregate values
            document.getElementById('pending').textContent = data.leaveAggregates.Pending;
            document.getElementById('accepted').textContent = data.leaveAggregates.Accepted;
            document.getElementById('rejected').textContent = data.leaveAggregates.Rejected;
        })
        .catch(error => console.error('Error fetching leave records:', error));
}

// Function to approve leave
function approveLeave(leaveId) {
    updateLeaveStatus(leaveId, 1); // Status code 1 for approved
}

// Function to reject leave
function rejectLeave(leaveId) {
    updateLeaveStatus(leaveId, 2); // Status code 2 for rejected
}

// Function to update leave status via AJAX
function updateLeaveStatus(leaveId, status) {
    fetch('/updateLeaveStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leaveId, status })
    })
    .then(response => {
        if (response.ok) {
            fetchLeaveRecords(); // Refresh leave records after status update
        } else {
            console.error('Failed to update leave status');
        }
    })
    .catch(error => console.error('Error updating leave status:', error));
}

// Call the function to fetch and update leave records on page load
fetchLeaveRecords();


document.getElementById('refresh').addEventListener('click', () =>{
    window.location.href = "manage.html";
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
