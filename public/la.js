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




function check(val) {
  if (val === "") {
    return -1;
  } else {
    return val;
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.getElementById("apply").addEventListener("click", () => {
  const fromDate = new Date(
    check(document.getElementById("fromDate").value)
  );
  const toDate = new Date(check(document.getElementById("toDate").value));
  const leaveType = check(document.getElementById("leaveType").value);
  const reason = check(document.getElementById("reason").value);

  if (
    fromDate !== -1 &&
    toDate !== -1 &&
    leaveType !== -1 &&
    reason !== -1
  ) {
    // Format dates to 'YYYY-MM-DD'
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const FD = new Date(formattedFromDate);
    const TD = new Date(formattedToDate);
    const timeDifference = TD.getTime() - FD.getTime();
    const totalDays = Math.round(timeDifference / oneDay);
    if (
      formattedFromDate >= formatDate(new Date()) &&
      formattedToDate >= formattedFromDate
    ) {
      // Valid date range, send data to the server
      const v1 = currentUser.designationId;
      const v2 = currentUser.empId;
      const v3 = currentUser.supervisorId;
      const status = 0;
      const data = {
        leaveType,
        v1,
        v2,
        v3,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        totalDays,
        reason,
        status
      };

      // Send data to the server
      fetch("/submitLeaveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          var toast = document.getElementById("toast");
        toast.innerHTML = "Success!";
        toast.classList.add("show");
        setTimeout(function(){
            toast.classList.remove("show");
            window.location.href = 'ld.html';
        }, 1000);
         
        })
        .catch((error) => {
          console.log(data);
          alert("Failed to submit leave request. Please try again.");
        });
    } else {
      alert("Please select a valid date.");
    }
  } else {
    alert("Please provide valid values");
  }
});

document.getElementById('cancel').addEventListener('click', () => {
  window.location.href ='ld.html';
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




