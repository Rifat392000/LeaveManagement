CREATE DATABASE LeaveManagement;

USE LeaveManagement;

-- Designation
CREATE TABLE Designation(
   designationId int NOT NULL PRIMARY KEY,
  designationName varchar(100) not null
);

INSERT INTO Designation ( designationId,designationName) VALUES (100,'Director');
INSERT INTO Designation ( designationId,designationName) VALUES (200,'General Manager');
INSERT INTO Designation ( designationId,designationName) VALUES (300,'Executive');
INSERT INTO Designation ( designationId,designationName) VALUES (400,'Officer');


-- Employee


CREATE TABLE Employee (
  empId int NOT NULL PRIMARY KEY,
  designationId int NOT NULL,
  empName varchar(250),
  supervisorId int NOT NULL,
  empPassword varchar(50) NOT NULL,
  FOREIGN KEY (designationId) REFERENCES Designation(designationId)
);

drop table employee;

INSERT INTO Employee (empId, designationId, empName, supervisorId, empPassword)
VALUES 
  (1001, 400, 'Abdul Ahad Rifat', 1003, 'User1234'),
  (1002, 400, 'Niaz Ahmed', 1003, 'User5678'),
  (1003, 300, 'Maxwell', 1004, 'Ex1234'),
  (1004, 200, 'Moshiur Rahman', 100, 'Boss1234'), -- Corrected data types
  (1005, 200, 'Ali Mortuza Bilash', 100, 'Boss1234'); -- Corrected data types
       
select * from employee;
-- Leaves

create table leaves(

leaveTypeId int not null primary key,
leaveName varchar(150) not null unique

);

Insert INTO leaves (leaveTypeId,leaveName) VALUES 
(10,'Sick Leave'),
(20,'Personal Leave'),
(30,'Casual Leave');



CREATE TABLE leaveRecord (
    Lid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    leaveTypeId INT NOT NULL,
    designationId INT NOT NULL,
    empId INT NOT NULL,
    supervisorId INT NOT NULL,
    fromDate DATE NOT NULL,
    toDate DATE NOT NULL,
    days INT NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status INT NOT NULL,
    FOREIGN KEY (empId) REFERENCES Employee(empId)
);

ALTER TABLE leaveRecord AUTO_INCREMENT = 5001;  -- Set auto_increment starting value

select * from leaveRecord;





select Lid, leaveTypeId,fromDate,toDate,days,reason,status
from leaveRecord
where empId=1002;



select Lid, leaveTypeId,fromDate,toDate,days,reason,status
from leaveRecord
where supervisorId=?;


SELECT
  SUM(CASE WHEN leaveTypeId = 1 and status = 1  THEN 1 ELSE 0 END) AS Personal,
  SUM(CASE WHEN leaveTypeId = 2 and status = 1  THEN 1 ELSE 0 END) AS Sick,
  SUM(CASE WHEN leaveTypeId = 3 and status = 1  THEN 1 ELSE 0 END) AS Casual,
SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS Pending,
  SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS Accepted,
  SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS Rejected
  
FROM
  leaveRecord
WHERE
  empId = ?;
  
  
  
  
  SELECT
SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS Pending,
  SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS Accepted,
  SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS Rejected
  
FROM
  leaveRecord
WHERE
 supervisorId = 1003;
  
  
  update leaveRecord
  set status = ?
  where Lid = ?
  
  
  
  
  
  select * from  leaveRecord;

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
