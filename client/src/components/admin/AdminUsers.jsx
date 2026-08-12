import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    Shield,
    User,
    UserCheck,
    UserX,
    RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getAdminUsers,
    updateUserRole,
    toggleUserStatus,
} from "../../services/adminApi";

const AdminUsers = () => {

    // ======================================
    // STATES
    // ======================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

    const [actionLoading, setActionLoading] = useState(null);

    // Stores selected role before clicking Update Role
    const [roleChanges, setRoleChanges] = useState({});


    // ======================================
    // LOAD USERS
    // ======================================

    const loadUsers = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getAdminUsers();

            const data = response?.data?.data || [];

            setUsers(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error(
                "ADMIN USERS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }

    }, []);


    // ======================================
    // INITIAL LOAD
    // ======================================

    useEffect(() => {

        let cancelled = false;

        const fetchUsers = async () => {

            try {

                const response = await getAdminUsers();

                const data = response?.data?.data || [];

                if (!cancelled) {

                    setUsers(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                    setLoading(false);
                }

            } catch (error) {

                if (!cancelled) {

                    console.error(
                        "ADMIN USERS ERROR:",
                        error
                    );

                    toast.error(
                        error?.response?.data?.message ||
                        "Failed to load users"
                    );

                    setLoading(false);
                }

            }

        };

        fetchUsers();

        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================
    // FILTER USERS
    // ======================================

    const filteredUsers = useMemo(() => {

        return users.filter((user) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                user.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesRole =
                roleFilter === "all"
                    ? true
                    : user.role === roleFilter;

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "blocked"
                        ? user.isBlocked === true
                        : user.isBlocked !== true;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });

    }, [
        users,
        search,
        roleFilter,
        statusFilter,
    ]);


    // ======================================
    // ROLE SELECT CHANGE
    // ======================================

    const handleRoleSelect = (
        userId,
        newRole
    ) => {

        setRoleChanges((prev) => ({
            ...prev,
            [userId]: newRole,
        }));

    };


    // ======================================
    // UPDATE ROLE
    // ======================================

    const handleRoleUpdate = async (user) => {

        const newRole =
            roleChanges[user._id] ||
            user.role;

        // Nothing changed
        if (newRole === user.role) {

            toast.error(
                "Please select a different role"
            );

            return;

        }

        try {

            setActionLoading(user._id);

            await updateUserRole(
                user._id,
                newRole
            );

            toast.success(
                "User role updated successfully"
            );

            // Remove temporary role
            setRoleChanges((prev) => {

                const updated = {
                    ...prev,
                };

                delete updated[user._id];

                return updated;

            });

            await loadUsers();

        } catch (error) {

            console.error(
                "UPDATE ROLE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update user role"
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================
    // BLOCK / UNBLOCK
    // ======================================

    const handleToggleBlock = async (user) => {

        const isBlocked =
            user.isBlocked === true;

        const action =
            isBlocked
                ? "unblock"
                : "block";

        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${user.name}?`
            );

        if (!confirmed) {

            return;

        }

        try {

            setActionLoading(user._id);

            await toggleUserStatus(
                user._id
            );

            toast.success(
                isBlocked
                    ? "User unblocked successfully"
                    : "User blocked successfully"
            );

            await loadUsers();

        } catch (error) {

            console.error(
                "TOGGLE USER STATUS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                `Failed to ${action} user`
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-gray-500">
                        Loading users...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                        <p className="text-sm font-medium text-gray-500">
                            NovaCart AI
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Users
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage users, roles and account access.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadUsers}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                    >

                        <RefreshCw size={18} />

                        Refresh

                    </button>

                </div>


                {/* ======================================
                    FILTERS
                ====================================== */}

                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
                        />

                    </div>


                    {/* ROLE FILTER */}

                    <select
                        value={roleFilter}
                        onChange={(e) =>
                            setRoleFilter(e.target.value)
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Roles
                        </option>

                        <option value="user">
                            Users
                        </option>

                        <option value="admin">
                            Admins
                        </option>

                    </select>


                    {/* STATUS FILTER */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    >

                        <option value="all">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="blocked">
                            Blocked
                        </option>

                    </select>

                </div>


                {/* ======================================
                    COUNT
                ====================================== */}

                <div className="mt-5">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-900">
                            {filteredUsers.length}
                        </span>{" "}

                        users

                    </p>

                </div>


                {/* ======================================
                    USERS TABLE
                ====================================== */}

                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">

                    {/* DESKTOP */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full min-w-250">

                            <thead>

                                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        User
                                    </th>

                                    <th className="px-6 py-4">
                                        Role
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Joined
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    (user) => {

                                        const selectedRole =
                                            roleChanges[user._id] ||
                                            user.role;

                                        const isLoading =
                                            actionLoading ===
                                            user._id;

                                        return (

                                            <tr
                                                key={user._id}
                                                className="border-b border-gray-100 last:border-0"
                                            >

                                                {/* USER */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-4">

                                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">

                                                            {user.avatar ? (

                                                                <img
                                                                    src={user.avatar}
                                                                    alt={user.name}
                                                                    className="h-full w-full object-cover"
                                                                />

                                                            ) : (

                                                                <div className="flex h-full items-center justify-center text-gray-400">

                                                                    <User
                                                                        size={20}
                                                                    />

                                                                </div>

                                                            )}

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="truncate font-semibold">
                                                                {user.name}
                                                            </p>

                                                            <p className="truncate text-sm text-gray-500">
                                                                {user.email}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* ROLE */}

                                                <td className="px-6 py-4">

                                                    {user.role === "admin" ? (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">

                                                            <Shield size={13} />

                                                            Admin

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">

                                                            <User size={13} />

                                                            User

                                                        </span>

                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    {user.isBlocked ? (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">

                                                            <UserX size={13} />

                                                            Blocked

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">

                                                            <UserCheck size={13} />

                                                            Active

                                                        </span>

                                                    )}

                                                </td>


                                                {/* JOINED */}

                                                <td className="px-6 py-4 text-sm text-gray-500">

                                                    {user.createdAt
                                                        ? new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* ROLE SELECT */}

                                                        <select
                                                            value={selectedRole}
                                                            disabled={isLoading}
                                                            onChange={(e) =>
                                                                handleRoleSelect(
                                                                    user._id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            <option value="user">
                                                                User
                                                            </option>

                                                            <option value="admin">
                                                                Admin
                                                            </option>

                                                        </select>


                                                        {/* UPDATE ROLE */}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isLoading ||
                                                                selectedRole === user.role
                                                            }
                                                            onClick={() =>
                                                                handleRoleUpdate(user)
                                                            }
                                                            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >

                                                            {isLoading
                                                                ? "Updating..."
                                                                : "Update Role"}

                                                        </button>


                                                        {/* BLOCK / UNBLOCK */}

                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() =>
                                                                handleToggleBlock(user)
                                                            }
                                                            className={
                                                                user.isBlocked
                                                                    ? "flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    : "flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            }
                                                        >

                                                            {user.isBlocked ? (
                                                                <UserCheck size={16} />
                                                            ) : (
                                                                <UserX size={16} />
                                                            )}

                                                            {user.isBlocked
                                                                ? "Unblock"
                                                                : "Block"}

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ======================================
                        MOBILE
                    ====================================== */}

                    <div className="divide-y md:hidden">

                        {filteredUsers.map(
                            (user) => {

                                const selectedRole =
                                    roleChanges[user._id] ||
                                    user.role;

                                const isLoading =
                                    actionLoading ===
                                    user._id;

                                return (

                                    <div
                                        key={user._id}
                                        className="p-4"
                                    >

                                        <div className="flex gap-4">

                                            {/* AVATAR */}

                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">

                                                {user.avatar ? (

                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full items-center justify-center text-gray-400">

                                                        <User size={20} />

                                                    </div>

                                                )}

                                            </div>


                                            {/* USER INFO */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <h3 className="font-semibold">
                                                            {user.name}
                                                        </h3>

                                                        <p className="mt-1 break-all text-sm text-gray-500">
                                                            {user.email}
                                                        </p>

                                                    </div>

                                                    {user.isBlocked && (

                                                        <UserX
                                                            size={18}
                                                            className="shrink-0 text-red-500"
                                                        />

                                                    )}

                                                </div>


                                                <div className="mt-3 flex flex-wrap gap-2">

                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">

                                                        {user.role === "admin"
                                                            ? "Admin"
                                                            : "User"}

                                                    </span>


                                                    <span
                                                        className={
                                                            user.isBlocked
                                                                ? "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                                                                : "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                                                        }
                                                    >

                                                        {user.isBlocked
                                                            ? "Blocked"
                                                            : "Active"}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* MOBILE ACTIONS */}

                                        <div className="mt-5 grid grid-cols-1 gap-2">

                                            {/* ROLE */}

                                            <select
                                                value={selectedRole}
                                                disabled={isLoading}
                                                onChange={(e) =>
                                                    handleRoleSelect(
                                                        user._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-black disabled:opacity-50"
                                            >

                                                <option value="user">
                                                    User
                                                </option>

                                                <option value="admin">
                                                    Admin
                                                </option>

                                            </select>


                                            {/* UPDATE ROLE BUTTON */}

                                            <button
                                                type="button"
                                                disabled={
                                                    isLoading ||
                                                    selectedRole === user.role
                                                }
                                                onClick={() =>
                                                    handleRoleUpdate(user)
                                                }
                                                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                            >

                                                {isLoading
                                                    ? "Updating..."
                                                    : "Update Role"}

                                            </button>


                                            {/* BLOCK / UNBLOCK */}

                                            <button
                                                type="button"
                                                disabled={isLoading}
                                                onClick={() =>
                                                    handleToggleBlock(user)
                                                }
                                                className={
                                                    user.isBlocked
                                                        ? "flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 px-4 py-3 text-sm font-semibold text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                                                        : "flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                                }
                                            >

                                                {user.isBlocked ? (
                                                    <UserCheck size={17} />
                                                ) : (
                                                    <UserX size={17} />
                                                )}

                                                {user.isBlocked
                                                    ? "Unblock User"
                                                    : "Block User"}

                                            </button>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    {/* ======================================
                        EMPTY STATE
                    ====================================== */}

                    {filteredUsers.length === 0 && (

                        <div className="px-6 py-16 text-center">

                            <User
                                size={40}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold">
                                No users found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search or filters.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default AdminUsers;