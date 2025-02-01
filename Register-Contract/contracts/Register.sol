// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Register {

    struct Student {
        uint studentId;
        string studentName;
        bool isRemoved;
    }

    uint public count;
    address admin;
    Student student;

    mapping (uint=>Student) student_map;
    mapping (uint=>Student) count_map;

    

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin(){
        require(msg.sender == admin);
        _;
    }

    function registerStudent(uint _studentId, string memory _studentName) public onlyAdmin {
        require(msg.sender != address(0), "Address zero not valid");
        count++;
        student = Student(_studentId, _studentName, false);
        student_map[_studentId] = student;
        count_map[count] = student;

    }

    function removeStudent(uint _studentId) public onlyAdmin {
        require(msg.sender != address(0), "Address zero not valid");
        student_map[_studentId].isRemoved = true;
        count_map[count].isRemoved = true;
        count--;
    }

    function getStudentById(uint _studentId) public view returns (Student memory) {
        require(student_map[_studentId].isRemoved == false, "Student has been deleted");
        return student_map[_studentId];
    }

    function getStudentList()public view returns(Student[] memory){
        Student[] memory studentList = new Student[](count);
        uint counter = 0;
        for(uint i = 1; i <= count; i++){
            if(count_map[i].isRemoved == false){
                studentList[counter] = count_map[i];
                counter++;
            }
        }
        
        return studentList;
    }

}