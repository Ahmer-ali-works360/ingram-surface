"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    reseller: string;
    role: string;
    status: string;
    created_at: string;
};

export default function UsersListPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // UI state
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortAsc, setSortAsc] = useState(false);

    // Fetch users
    async function fetchUsers() {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, reseller, role, status, created_at")
            .order("created_at", { ascending: sortAsc });

        if (error) console.error(error);
        else setUsers(data as Profile[]);
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [sortAsc]);

    // Approve / Reject
    async function updateStatus(id: string, status: "approved" | "rejected") {
        setUpdatingId(id);
        const { error } = await supabase
            .from("profiles")
            .update({ status })
            .eq("id", id);

        if (!error) fetchUsers();
        setUpdatingId(null);
    }

    // Search & pagination
    const filteredUsers = useMemo(
        () =>
            users.filter((u) =>
                `${u.first_name} ${u.last_name} ${u.email} ${u.reseller}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        [users, search]
    );

    const totalPages = Math.ceil(filteredUsers.length / perPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

    // Download Excel
   function downloadExcel() {
    if (paginatedUsers.length === 0) return;

    const data = paginatedUsers.map((u) => ({
        Name: `${u.first_name} ${u.last_name}`,
        Email: u.email,
        Reseller: u.reseller,
        Role: u.role,
        Status: u.status,
        "Registered At": new Date(u.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `users_page_${page}.xlsx`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}


    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">Users Management</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-72 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex items-center gap-2 text-sm">
                    <span>Users per page</span>
                    <select
                        value={perPage}
                        onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                        className="border border-gray-300 rounded-md px-2 py-1"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    {/* Download Button */}
                    <img
                        src="/download-excel.png"       // replace with your image path
                        alt="Download Excel"
                        className="w-36 h-14 cursor-pointer hover:opacity-80"
                        onClick={downloadExcel}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-50 text-blue-900 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left border-r border-gray-200">Name</th>
                            <th className="px-4 py-3 text-left border-r border-gray-200">Email</th>
                            <th className="px-4 py-3 text-left border-r border-gray-200">Reseller</th>
                            <th className="px-4 py-3 text-left border-r border-gray-200">Role</th>
                            <th className="px-4 py-3 text-left border-r border-gray-200">Status</th>
                            <th
                                className="px-4 py-3 text-left cursor-pointer border-r border-gray-200"
                                onClick={() => setSortAsc(!sortAsc)}
                            >
                                Registered At {sortAsc ? "↑" : "↓"}
                            </th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8">Loading users...</td>
                            </tr>
                        ) : paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">No users found</td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user, index) => (
                                <tr key={user.id} className={`transition hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                    <td className="px-4 py-3 font-medium border-r border-gray-200">{user.first_name} {user.last_name}</td>
                                    <td className="px-4 py-3 border-r border-gray-200">{user.email}</td>
                                    <td className="px-4 py-3 border-r border-gray-200">{user.reseller}</td>
                                    <td className="px-4 py-3 border-r border-gray-200 capitalize">{user.role}</td>
                                    <td className="px-4 py-3 border-r border-gray-200">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : user.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-200">{new Date(user.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        {user.status === "pending" && (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    disabled={updatingId === user.id}
                                                    onClick={() => updateStatus(user.id, "approved")}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    disabled={updatingId === user.id}
                                                    onClick={() => updateStatus(user.id, "rejected")}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span className="text-sm">Page {page} of {totalPages}</span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
