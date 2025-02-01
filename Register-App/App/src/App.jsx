import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UserPlus, Trash2, Wallet, Users, RefreshCw, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import abi from './abi.json';
import "./index.css";

const StudentRegistration = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const contractAddress = "0xb27525753E2B2855f4235A556DEa212BB87b2418";

  useEffect(() => {
    requestAccount();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      getStudentList();
    }
  }, [isConnected]);

  const handleAccountChange = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setWalletAddress('');
      setStudents([]);
    } else {
      setWalletAddress(accounts[0]);
    }
  }

  const requestAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        toast.success('Wallet connected successfully!');
        await getStudentList();
      } catch (error) {
        toast.error('Failed to connect wallet!');
      }
    } else {
      toast.error('Please install MetaMask!');
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setStudents([]);
    toast.success('Wallet disconnected!');
  }

  const registerStudent = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first!');
      return;
    }
    
    if (!studentId || !studentName) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      toast.loading('Registering student...', { duration: 1000 });
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      toast.success('Student registered successfully!');
      await getStudentList();
      setStudentId('');
      setStudentName('');
    } catch (error) {
      toast.error('Failed to register student!');
      console.error(error);
    }
  }

  const removeStudent = async (id) => {
    if (!isConnected) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      toast.loading('Removing student...', { duration: 1000 });
      const tx = await contract.removeStudent(id);
      await tx.wait();
      toast.success('Student removed successfully!');
      await getStudentList();
    } catch (error) {
      toast.error('Failed to remove student!');
      console.error(error);
    }
  }

  const getStudentList = async () => {
    if (!isConnected) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      toast.loading('Fetching students...', { duration: 1000 });
      const studentList = await contract.getStudentList();
      console.log(studentList)
      const formattedStudents = studentList.map(student => ({
        studentId: Number(student.studentId),
        studentName: student.studentName,
        isRemoved: student.isRemoved
      }));
      setStudents(formattedStudents);
      toast.success('Student list updated!');
    } catch (error) {
      toast.error('Failed to fetch students!');
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="p-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Student Registration
            </h1>
            
            <div className="flex justify-center mb-8">
              {!isConnected ? (
                <button
                  onClick={requestAccount}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3 text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
                    <Wallet className="w-4 h-4" />
                    <span className="font-mono text-sm">{walletAddress}</span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <input
                type="number"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={registerStudent}
                disabled={!isConnected}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <UserPlus className="w-5 h-5" />
                Register Student
              </button>
              <button
                onClick={getStudentList}
                disabled={!isConnected}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Students List Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Registered Students ({students.length})
            </h2>

            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="p-6 rounded-xl bg-gradient-to-r from-white to-blue-50/30 border border-blue-100 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {student.studentName}
                        </h3>
                        <p className="text-gray-600">ID: {student.studentId}</p>
                      </div>
                      <button
                        onClick={() => removeStudent(student.studentId)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-500">
                  No students registered yet. Add your first student above!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;