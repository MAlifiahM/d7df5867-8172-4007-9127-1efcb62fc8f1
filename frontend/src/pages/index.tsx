import TableView, { Employee } from "@/components/table";
import React, {useCallback, useEffect, useState} from "react";
import api from "@/utils/api";
import Pagination from "@/components/pagination";
import IconButton from "@/components/iconButton";
import { faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
const Home = () => {
    const [employees, setEmployees] = useState<Employee[] | []>([]);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>('firstname');
    const [loading, setLoading] = useState<boolean>(true);
    const [editedEmployee, setEditedEmployee] = useState<Employee[] | null>(null);
    const [tempIdCounter, setTempIdCounter] = useState<number>(0);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [limit, setLimit] = useState<number>(5);
    const [selectedCriterion, setSelectedCriterion] = useState('firstname');
    const [searchText, setSearchText] = useState('');

    const fetchEmployees = useCallback(async () => {
        try {
            const paramItems: {[key:string]: string | number} = {
                page: page,
                sortBy: sortBy,
                order: sortDirection,
                limit: limit,
            }

            if (searchText !== '') {
                paramItems[selectedCriterion] = searchText;
            }

            const response = await api.get('/employees', {
                params: paramItems
            });
            setMaxPage(response.data.totalPages);
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, sortDirection, limit, searchText, selectedCriterion]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setLimit(newLimit)
    }

    const handleCriterionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCriterion(event.target.value);
    };

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleSortChange = (sortBy: keyof Employee, sortDirection: 'asc' | 'desc') => {
        setSortBy(sortBy);
        setSortDirection(sortDirection);
    };

    const handleAddNew = () => {
        const tempId = `temp-${tempIdCounter}`;
        const emptyEmployee: Employee = {
            _id: tempId,
            email: '',
            firstname: '',
            lastname: '',
            position: '',
            phone: '',
        }
        setEmployees((prevEmployees) => [emptyEmployee, ...prevEmployees]);
        setTempIdCounter(tempIdCounter + 1);
    }

    const handleEdit = (updatedEmployee: Employee[]) => {
        setEditedEmployee(updatedEmployee);
    };

    const handleSave = async () => {
        if (editedEmployee) {
            try {
                const updates = editedEmployee?.map(async (editEmp) => {
                    if (editEmp._id.includes('temp-')) {
                        const response = await api.post('/employees', {
                            email: editEmp.email,
                            firstname: editEmp.firstname,
                            lastname: editEmp.lastname,
                            position: editEmp.position,
                            phone: editEmp.phone
                        });
                        return response.data;
                    }else {
                        const response = await api.put(`/employees/${editEmp._id}`, {
                            email: editEmp.email,
                            firstname: editEmp.firstname,
                            lastname: editEmp.lastname,
                            position: editEmp.position,
                            phone: editEmp.phone
                        });
                        return response.data;
                    }
                }) || [];

                await Promise.all(updates);
                setEditedEmployee(null);
                await fetchEmployees();
            } catch (error) {
                console.error('Error updating employee:', error);
            }
        }
    };

    const handleSaveDelete = async () => {
        if (deletedIds.length > 0) {
            try {
                await Promise.all(deletedIds.map(async (id) => {
                    await api.delete(`/employees/${id}`);
                }));
                setDeletedIds([]);
                await fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleDelete = async (id: string[]) => {
        setDeletedIds(id);
    };

    return (
        <div className="h-full">
            {loading ? (
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="bg-gray-500 text-white py-2 px-4 rounded flex items-center justify-center"
                        disabled
                    >
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Processing ...
                    </button>
                </div>
            ) : (
                <div className="container items-center mx-auto p-4">
                    <div className="flex justify-between items-center">
                        <div className="float-left mb-2 flex items-center">
                            <select name="limit" id="limit" className="border border-gray-300 rounded-lg p-2" defaultValue={limit} onChange={handleLimitChange}>
                                <option value={1}>1</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <div className="ms-2 flex items-center space-x-2">
                                <select
                                    value={selectedCriterion}
                                    onChange={handleCriterionChange}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    <option value="firstname">First Name</option>
                                    <option value="lastname">Last Name</option>
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                    <option value="position">Position</option>
                                </select>
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={handleSearchTextChange}
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                        <div className="float-right mb-2">
                            <IconButton icon={faTrash} className="bg-red-500 text-white py-2 px-4 rounded"
                                        onClick={handleSaveDelete}/>
                            <IconButton icon={faPlus} className="bg-green-500 text-white py-2 px-4 rounded mx-2"
                                        onClick={handleAddNew}/>
                            <IconButton icon={faSave} className="bg-blue-500 text-white py-2 px-4 rounded"
                                        onClick={handleSave}/>
                        </div>
                    </div>
                    <TableView
                        data={employees}
                        onSortChange={handleSortChange}
                        onEdit={handleEdit}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onDelete={handleDelete}
                    />
                    <Pagination currentPage={page} onPageChange={setPage} maxPage={maxPage} />
                </div>
            )}
        </div>
    );
};

export default Home;