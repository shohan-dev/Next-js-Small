"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import fetchUsers from "@/hook/getuser";

interface User {
    _id: string;
    name: string;
    email: string;
}

const Page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterInputs, setFilterInputs] = useState({ name: "", email: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const users = await fetchUsers(searchParams);
                setData(users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterInputs({ ...filterInputs, [name]: value });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (filterInputs.name) params.set("name", filterInputs.name);
        if (filterInputs.email) params.set("email", filterInputs.email);
        router.push(`?${params.toString()}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>This is Test Page</h1>
            <div>
                <label>
                    Name: <input type="text" className="bg-black border border-white" name="name" value={filterInputs.name} onChange={handleInputChange} />
                </label>
                <label>
                    Email: <input type="text" className="bg-black border border-white" name="email" value={filterInputs.email} onChange={handleInputChange} />
                </label>
                <button onClick={handleSearch}>Search</button>
            </div>
            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item._id}>
                        <h2>{item.name}</h2>
                        <p>{item.email}</p>
                    </div>
                ))
            ) : (
                <p>No users found.</p>
            )}
        </>
    );
};

export default Page;