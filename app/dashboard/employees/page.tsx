'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Smartphone, 
  Clock, 
  Plus, 
  X,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  FileText,
  Download
} from 'lucide-react';
import { exportToCSV } from '@/lib/exportUtils';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    department: 'Sales',
    showroom: 'Mumbai'
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (search) params.append('search', search);
      
      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadList = () => {
    if (employees.length === 0) return;
    const exportData = employees.map(emp => ({
      Name: `${emp.firstName} ${emp.lastName}`,
      Designation: emp.designation,
      Department: emp.department,
      Status: emp.attendance ? 'Active' : 'Offline',
      CheckIn: emp.attendance ? new Date(emp.attendance.entryTime).toLocaleTimeString() : '—',
      Productivity: `${emp.productivityScore}%`
    }));
    exportToCSV(exportData, 'Employee_Monitoring_Export');
  };

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (activeMenu) setActiveMenu(null);
    };
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, [activeMenu]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300); // 300ms debounce for search
    return () => clearTimeout(timer);
  }, [department, search]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewEmployee({
          firstName: '',
          lastName: '',
          designation: '',
          department: 'Sales',
          showroom: 'Mumbai'
        });
        fetchEmployees();
      }
    } catch (error) {
      console.error('Failed to add employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-6 rounded-2xl border border-white backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time tracking of staff performance and presence.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#c5a059] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-[#e5e1da] text-slate-700 py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm w-full md:w-64"
            />
          </div>
          <div className="relative">
             <select 
              className="appearance-none bg-white border border-[#e5e1da] text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm cursor-pointer min-w-[160px]"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Billing">Billing</option>
              <option value="Security">Security</option>
              <option value="Management">Management</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <button 
            onClick={handleDownloadList}
            className="bg-white border border-[#e5e1da] text-[#c5a059] px-5 py-2.5 rounded-xl hover:bg-[#f9f6f1] transition-all flex items-center shadow-sm text-sm"
            title="Download Employee List"
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#c5a059] text-white px-5 py-2.5 rounded-xl hover:bg-[#b08e4d] transition-all flex items-center space-x-2 font-bold shadow-lg shadow-[#c5a059]/20 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Employees Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e1da] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9f6f1] border-b border-[#e5e1da]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Live Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Check In</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Mobile Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-xs font-bold text-[#c5a059] uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f9f6f1]">
              {loading && employees.length === 0 ? (
                 <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                   <div className="flex flex-col items-center">
                     <div className="w-10 h-10 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p>Updating staff records...</p>
                   </div>
                 </td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No employees found matching your criteria.</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-[#f9f6f1]/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#f9f6f1] to-[#e5e1da] border border-[#e5e1da] flex items-center justify-center text-[#c5a059] font-black text-sm">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{emp.firstName} {emp.lastName}</p>
                        <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">{emp.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-white border border-[#e5e1da] text-[#8d7b68] uppercase tracking-wider">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {emp.attendance ? (
                      <span className="flex items-center space-x-1.5 text-[11px] font-black text-emerald-600 uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Offline</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {emp.attendance ? (
                      <div className="flex items-center space-x-2 text-sm font-medium text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-[#c5a059]" />
                        <span>{new Date(emp.attendance.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <Smartphone className={`h-3.5 w-3.5 ${emp.attendance?.mobileUsageMinutes > 30 ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span className={`text-sm ${emp.attendance?.mobileUsageMinutes > 30 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                          {emp.attendance?.mobileUsageMinutes || 0}m
                        </span>
                      </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1.5">
                      <div className="w-24 bg-[#f9f6f1] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            emp.productivityScore >= 80 ? 'bg-emerald-500' : 
                            emp.productivityScore >= 50 ? 'bg-[#c5a059]' : 'bg-rose-500'
                          }`} 
                          style={{ width: `${emp.productivityScore}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`text-[10px] font-black uppercase ${
                          emp.productivityScore >= 80 ? 'text-emerald-600' : 
                          emp.productivityScore >= 50 ? 'text-[#c5a059]' : 'text-rose-600'
                        }`}>
                          {emp.productivityScore}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Productivity</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === emp._id ? null : emp._id);
                      }}
                      className="p-2 text-slate-300 hover:text-[#c5a059] hover:bg-[#c5a059]/5 rounded-lg transition-all"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {activeMenu === emp._id && (
                      <div className="absolute right-6 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-[#e5e1da] z-50 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right text-left">
                        <div className="p-1.5">
                          <button className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#f9f6f1] rounded-xl transition-all">
                            <Edit className="h-3.5 w-3.5 text-[#c5a059]" />
                            <span>Edit Profile</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#f9f6f1] rounded-xl transition-all">
                            <FileText className="h-3.5 w-3.5 text-[#8d7b68]" />
                            <span>View History</span>
                          </button>
                          <div className="h-px bg-[#f9f6f1] my-1 mx-2" />
                          <button className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Suspend Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#f9f6f1] p-6 border-b border-[#e5e1da] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Add New Staff</h3>
                <p className="text-xs text-[#8d7b68] font-bold uppercase tracking-wider mt-0.5">Showroom Personnel Registration</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    required
                    type="text" 
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    placeholder="Enter first name"
                    className="w-full bg-[#f9f6f1] border border-[#e5e1da] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    required
                    type="text" 
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    placeholder="Enter last name"
                    className="w-full bg-[#f9f6f1] border border-[#e5e1da] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                <input 
                  required
                  type="text" 
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                  placeholder="e.g. Senior Fashion Consultant"
                  className="w-full bg-[#f9f6f1] border border-[#e5e1da] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
                  <select 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="w-full bg-[#f9f6f1] border border-[#e5e1da] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm font-medium cursor-pointer"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Billing">Billing</option>
                    <option value="Security">Security</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                   <input 
                    required
                    type="text" 
                    value={newEmployee.showroom}
                    onChange={(e) => setNewEmployee({...newEmployee, showroom: e.target.value})}
                    placeholder="e.g. Mumbai Main"
                    className="w-full bg-[#f9f6f1] border border-[#e5e1da] rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/20 focus:border-[#c5a059] transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c5a059] text-white py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-[#b08e4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#c5a059]/30 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Register Staff Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
