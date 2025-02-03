"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import fetchUsers from "@/hook/getuser";

interface User {
    _id: string;
    id: number;
    name: string;
    email: string;
    age: number;
    city: string;
    country: string;
    phone: string;
    occupation: string;
    company: string;
    active: boolean;
}

const Page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<User[]>([]);
    const [filterInputs, setFilterInputs] = useState({
        name: searchParams.get("name") || "",
        email: searchParams.get("email") || "",
        age: searchParams.get("age") || "",
        city: searchParams.get("city") || "",
        country: searchParams.get("country") || "",
        phone: searchParams.get("phone") || "",
        occupation: searchParams.get("occupation") || "",
        company: searchParams.get("company") || "",
        active: searchParams.get("active") || ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const users = await fetchUsers(searchParams);
                setData(users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchData();
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        Object.entries(filterInputs).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`?${params.toString()}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };



    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">User Search</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.keys(filterInputs).map((key) => (
                    <div key={key} className="flex flex-col">
                        <label className="mb-2 font-semibold text-white">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                            type="text"
                            style={{ color: "black" }}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name={key}
                            value={filterInputs[key as keyof typeof filterInputs]}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                ))}
            </div>
            <div className="text-center">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300"
                >
                    Search
                </button>
            </div>

            <div className="mt-8">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item._id} className="p-6 border rounded-lg mb-4 shadow-md hover:shadow-lg transition duration-300">
                            <h2 className="text-xl font-semibold ">{item.name}</h2>
                            <p className="">{item.email} | {item.age} | {item.phone}</p>
                            <p className="">{item.city}, {item.country} - {item.occupation} at {item.company}</p>
                            <p className="">Status: <span className={item.active ? "text-green-500" : "text-red-500"}>{item.active.toString()}</span></p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Page;