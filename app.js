const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5760;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'leavemanagement',
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
    } else {
        console.log('Connected to MySQL database!');
    }
});

app.post('/login', (req, res) => {
    const { user, pass } = req.body;

    const sql = `
        SELECT 
            E.empId, 
            E.empName, 
            E.designationId,
            D.designationName AS employeeDesignation,
            E.supervisorId,
            S.empName AS supervisorName
        FROM 
            Employee AS E
        INNER JOIN 
            Designation AS D ON E.designationId = D.designationId
        LEFT JOIN 
            Employee AS S ON E.supervisorId = S.empId
        WHERE 
            E.empId = ?
            AND E.empPassword = ?;
    `;

    connection.query(sql, [user, pass], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
            return;
        }

        if (result.length === 1) {
            const userInformation = result[0];
            res.json({ success: true, user: userInformation });
        } else {
            res.json({ success: false, error: 'Invalid username or password' });
        }
    });
});




app.get('/employees', (req, res) => {
   
    const sqlQuery = `
    SELECT 
    E.empId, 
    E.empName, 
    D.designationName AS employeeDesignation,
    S.empName AS supervisorName
FROM 
    Employee AS E
INNER JOIN 
    Designation AS D ON E.designationId = D.designationId
LEFT JOIN 
    Employee AS S ON E.supervisorId = S.empId;
    `;

    // Execute the SQL query
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.post('/submitLeaveRequest', (req, res) => {
    const leaveType = req.body.leaveType;
    const v1 = req.body.v1;
    const v2 = req.body.v2;
    const v3 = req.body.v3;
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const totalDays = req.body.totalDays;
    const reason = req.body.reason;
    const status = req.body.status;

    // Insert data into MySQL
    const query = `
      INSERT INTO leaveRecord (leaveTypeId, designationId, empId, supervisorId, fromDate, toDate, days, reason, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [leaveType, v1, v2, v3, fromDate, toDate, totalDays, reason, status], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'Leave request submitted successfully' });
    });
});




app.get('/leaveRecords', (req, res) => {
    const empId = req.query.empId;

    const sqlQuery = `
        SELECT Lid, leaveTypeId, fromDate, toDate, days, reason, status
        FROM leaveRecord
        WHERE empId = ?
    `;

    // Execute the SQL query
    connection.query(sqlQuery, [empId], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Execute the aggregation query
            const aggregationQuery = `
                SELECT
                    SUM(CASE WHEN leaveTypeId = 1 and status = 1  THEN 1 ELSE 0 END) AS Personal,
                    SUM(CASE WHEN leaveTypeId = 2 and status = 1  THEN 1 ELSE 0 END) AS Sick,
                    SUM(CASE WHEN leaveTypeId = 3 and status = 1  THEN 1 ELSE 0 END) AS Casual,
                    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS Pending,
                    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS Accepted,
                    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS Rejected
                FROM leaveRecord
                WHERE empId = ?;
            `;
            // Execute the aggregation query
            connection.query(aggregationQuery, [empId], (aggErr, aggResults) => {
                if (aggErr) {
                    console.error('Error executing aggregation SQL query:', aggErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    const leaveRecords = {
                        leaveRecords: results,
                        leaveAggregates: aggResults[0] // Assuming it returns only one row
                    };
                    res.json(leaveRecords);
                }
            });
        }
    });
});


app.get('/leaveRecordsM', (req, res) => {
    const empId = req.query.empId;
    const status = req.query.status;

    const sqlQuery = `
    SELECT l.Lid, l.empId AS emp , e.empName, l.leaveTypeId, l.fromDate, l.toDate, l.days, l.reason, l.status
    FROM leaveRecord l
    INNER JOIN employee e ON l.empId = e.empId
    WHERE e.supervisorId = ? AND l.status = ?;
    `;

    // Execute the SQL query
    connection.query(sqlQuery, [empId,status], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Execute the aggregation query
            const aggregationQuery = `
            SELECT
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS Pending,
              SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS Accepted,
              SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS Rejected
              
            FROM
              leaveRecord
            WHERE
             supervisorId = ?;
            `;
            // Execute the aggregation query
            connection.query(aggregationQuery, [empId], (aggErr, aggResults) => {
                if (aggErr) {
                    console.error('Error executing aggregation SQL query:', aggErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    const leaveRecords = {
                        leaveRecords: results,
                        leaveAggregates: aggResults[0] 
                    };
                    res.json(leaveRecords);
                }
            });
        }
    });
});



app.post('/updateLeaveStatus', (req, res) => {
    const { leaveId, status } = req.body;

    // SQL query to update leave status
    const sql = 'UPDATE leaveRecord SET status = ? WHERE Lid = ?';

    // Execute the query
    connection.query(sql, [status, leaveId], (err, result) => {
        if (err) {
            console.error('Error updating leave status:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Leave status updated successfully');
        res.sendStatus(200);
    });
});





app.use((req, res) => {
    const filePath = path.join(__dirname, 'public', '404.html');
    res.status(404).sendFile(filePath);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
