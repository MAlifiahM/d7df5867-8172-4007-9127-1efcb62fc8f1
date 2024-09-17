import React, { useState, useEffect } from "react";
export interface Employee {
    _id: string;
    firstname: string;
    lastname: string;
    position: string;
    phone: string;
    email: string;
}
interface TableViewProps {
    data: Employee[];
    onSortChange: (sortBy: keyof Employee, sortDirection: "asc" | "desc") => void;
    onEdit: (employee: Employee[]) => void;
    onDelete: (id: string[]) => void;
    sortBy: string;
    sortDirection: "asc" | "desc";
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string, emails: string[]): boolean => {
    const emailExists = emails.includes(email);
    return emailExists || emailRegex.test(email);
};

const TableView: React.FC<TableViewProps> = ({ data, sortDirection, sortBy, onSortChange, onEdit, onDelete }) => {
    const [editingCell, setEditingCell] = useState<{ employeeId: string; field: keyof Employee } | null>(null);
    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [editedData, setEditedData] = useState<Employee[]>(data);
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
    const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());
    const [deletedIds, setDeletedIds] = useState<string[]>([]);

    useEffect(() => {
        if (editingCell?.field === 'email') {
            const emails = editedData.map(emp => emp.email);
            if (emails.includes(email)) {
                setInvalidEmail(true);
            } else if (!isValidEmail(email, emails)) {
                setInvalidEmail(true);
            }else {
                setInvalidEmail(false);
            }
        }
    }, [email, editingCell, editedData]);

    useEffect(() => {
        setEditedData(data);
        setUnsavedChanges(new Set());
    }, [data]);

    const handleDoubleClick = (employeeId: string, field: keyof Employee) => {
        setEditingCell({ employeeId, field });
        const employee = editedData.find(emp => emp._id === employeeId);
        console.log("employee handle double click : ", employee);
        if (employee) {
            console.log("if employee handle double click : ", employee);
            switch (field) {
                case 'email':
                    setEmail(employee[field] as string);
                    break;
                case 'firstname':
                    setFirstname(employee[field] as string);
                    break;
                case 'lastname':
                    setLastname(employee[field] as string);
                    break;
                case 'position':
                    setPosition(employee[field] as string);
                    break;
                case 'phone':
                    setPhone(employee[field] as string);
                    break;
            }
        }
    };
    const handleBlur = () => {
        if (editingCell) {
            const value = (() => {
                switch(editingCell.field) {
                    case 'email': return email;
                    case 'firstname': return firstname;
                    case 'lastname': return lastname;
                    case 'position': return position;
                    case 'phone': return phone;
                }
            })();
            if (value !== undefined) {
                const updatedEmployees = editedData.map(employee =>
                    employee._id === editingCell.employeeId
                        ? { ...employee, [editingCell.field]: value }
                        : employee
                );
                console.log(updatedEmployees)
                setEditedData(updatedEmployees);
                const unsavedKey = `${editingCell.employeeId}-${editingCell.field}`;
                const updatedUnsavedChanges = new Set(unsavedChanges).add(unsavedKey);
                setUnsavedChanges(updatedUnsavedChanges);
                onEdit(updatedEmployees);
                setEditingCell(null);
            }
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Employee) => {
        switch(field) {
            case 'email': setEmail(e.target.value); break;
            case 'firstname': setFirstname(e.target.value); break;
            case 'lastname': setLastname(e.target.value); break;
            case 'position': setPosition(e.target.value); break;
            case 'phone': setPhone(e.target.value); break;
        }
        if (editingCell) {
            const unsavedKey = `${editingCell.employeeId}-${field}`;
            const updatedUnsavedChanges = new Set(unsavedChanges).add(unsavedKey);
            setUnsavedChanges(updatedUnsavedChanges);
        }
    };
    const handleSort = (field: keyof Employee) => {
        const newSortDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        onSortChange(field, newSortDirection);
    };
    const getCellBgColor = (employeeId: string, field: keyof Employee, value: string): string => {
        const unsavedKey = `${employeeId}-${field}`;
        const isEditingThisCell = editingCell?.employeeId === employeeId && editingCell.field === field;
        const isUnsavedChange = unsavedChanges.has(unsavedKey);

        if (field === 'email') {
            const emails = editedData.map(emp => emp.email).filter(email => email !== value);
            const invalidFormatEmail = value && !isValidEmail(value, emails);

            if (isEditingThisCell && invalidEmail && invalidFormatEmail) {
                return 'bg-red-200';
            }
            if (isUnsavedChange && invalidEmail && invalidFormatEmail) {
                return 'bg-red-200';
            }
            if (isUnsavedChange && invalidEmail && !invalidFormatEmail) {
                return 'bg-red-200';
            }
            if (isUnsavedChange && !invalidEmail && invalidFormatEmail) {
                return 'bg-red-200';
            }
            if (isUnsavedChange && !invalidEmail && !invalidFormatEmail) {
                return 'bg-green-200';
            }
        }

        if(field !== 'email') {
            if (isEditingThisCell && isUnsavedChange) {
                return 'bg-green-200';
            }
            if (isUnsavedChange) {
                return 'bg-green-200';
            }
        }

        return '';
    };

    const handleCheckboxChange = (id: string) => {
        setDeletedIds(prevIds => {
            const newIds = prevIds.includes(id) ? prevIds.filter(prevId => prevId !== id) : [...prevIds, id];
            onDelete(newIds);
            return newIds;
        });
    };

    return (
        <div>
            <table className="w-full text-sm text-left border border-gray-500 rounded-2xl">
                <thead className="uppercase text-gray-500">
                <tr className="border-b border-gray-500">
                    <th scope="col" className="px-6 py-3 cursor-pointer">
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('firstname')}>
                        First Name {sortBy === 'firstname' ? (sortDirection === 'asc' ? '▼' : '▲') : ''}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('lastname')}>
                        Last Name {sortBy === 'lastname' ? (sortDirection === 'asc' ? '▼' : '▲') : ''}
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('position')}>
                        Position {sortBy === 'position' ? (sortDirection === 'asc' ? '▼' : '▲') : ''}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Phone
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email
                    </th>
                </tr>
                </thead>
                <tbody>
                {editedData.length > 0 ? (
                    editedData.map((employee: Employee) => (
                        <tr key={employee._id} className="bg-white border-b border-gray-500 rounded-2xl">
                            <td className={`px-6 py-4 min-h-[3rem]`}>
                                <input
                                    type="checkbox"
                                    checked={deletedIds.includes(employee._id)}
                                    onChange={() => handleCheckboxChange(employee._id)}
                                />
                            </td>
                            <td className={`px-6 py-4 ${getCellBgColor(employee._id, 'firstname', firstname)} min-h-[3rem]`}
                                onDoubleClick={() => handleDoubleClick(employee._id, 'firstname')}>
                                {editingCell?.employeeId === employee._id && editingCell.field === 'firstname' ? (
                                    <input
                                        type="text"
                                        value={firstname}
                                        onChange={(e) => handleChange(e, 'firstname')}
                                        onBlur={handleBlur}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        autoFocus
                                    />
                                ) : employee.firstname}
                            </td>
                            <td className={`px-6 py-4 ${getCellBgColor(employee._id, 'lastname', lastname)} min-h-[3rem]`}
                                onDoubleClick={() => handleDoubleClick(employee._id, 'lastname')}>
                                {editingCell?.employeeId === employee._id && editingCell.field === 'lastname' ? (
                                    <input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => handleChange(e, 'lastname')}
                                        onBlur={handleBlur}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        autoFocus
                                    />
                                ) : employee.lastname}
                            </td>
                            <td className={`px-6 py-4 ${getCellBgColor(employee._id, 'position', position)} min-h-[3rem]`}
                                onDoubleClick={() => handleDoubleClick(employee._id, 'position')}>
                                {editingCell?.employeeId === employee._id && editingCell.field === 'position' ? (
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => handleChange(e, 'position')}
                                        onBlur={handleBlur}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        autoFocus
                                    />
                                ) : employee.position}
                            </td>
                            <td className={`px-6 py-4 ${getCellBgColor(employee._id, 'phone', phone)} min-h-[3rem]`}
                                onDoubleClick={() => handleDoubleClick(employee._id, 'phone')}>
                                {editingCell?.employeeId === employee._id && editingCell.field === 'phone' ? (
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => handleChange(e, 'phone')}
                                        onBlur={handleBlur}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        autoFocus
                                    />
                                ) : employee.phone}
                            </td>
                            <td className={`px-6 py-4 ${getCellBgColor(employee._id, 'email', email)} min-h-[3rem]`}
                                onDoubleClick={() => handleDoubleClick(employee._id, 'email')}>
                                {editingCell?.employeeId === employee._id && editingCell.field === 'email' ? (
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => handleChange(e, 'email')}
                                        onBlur={handleBlur}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        autoFocus
                                    />
                                ) : employee.email}
                                {
                                    email !== '' ?
                                        invalidEmail && (editingCell?.employeeId === employee._id || unsavedChanges.has(`${employee._id}-email`)) ? (
                                                <div className="bg-red-500 text-white px-2 py-1 rounded-lg fixed text-sm">
                                                    Invalid Email
                                                </div>
                                            )
                                            :
                                            ''
                                        : ''
                                }
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className="bg-white border-b border-gray-500 rounded-2xl">
                        <td colSpan={6} className="px-6 py-4 text-center">Data Not Found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};
export default TableView;