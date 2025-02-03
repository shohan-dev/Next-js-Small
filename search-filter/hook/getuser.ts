
const fetchUsers = async (query: unknown = "") => {
    try {
        const response = await fetch(`http://localhost:3000/api/user?${query}`, {
            cache: 'no-store',  // equivalent to no-cache
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Failed to fetch users', error);
        throw new Error('Failed to fetch users');
    }
}


export default fetchUsers;