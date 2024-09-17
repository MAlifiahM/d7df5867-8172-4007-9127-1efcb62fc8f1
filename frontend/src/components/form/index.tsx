import React, { useState, useEffect } from 'react';
import { Employee } from "@/components/table";

interface EmployeeFormProps {
    employee: Employee | null;
    onSave: (employee: Employee) => Promise<void>;
    onClear: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onClear }) => {
    const [formData, setFormData] = useState<Employee>(employee || {
        _id: '',
        firstname: '',
        lastname: '',
        position: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        setFormData(employee || {
            _id: '',
            firstname: '',
            lastname: '',
            position: '',
            phone: '',
            email: ''
        });
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        const { _id, ...employeeData } = formData;
        await onSave(employeeData as Employee);
        onClear();
    };

    return (
        <div>
            <input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
            />
            <input
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
            />
            <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Position"
            />
            <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
            />
            <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onClear}>Clear</button>
        </div>
    );
};

export default EmployeeForm;