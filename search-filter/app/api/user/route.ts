import { connectToMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Ensure MongoDB connection is established within the function
        const db = await connectToMongoDB();
        const usersCollection = db.collection('Users');

        // Extract query parameters from the request URL
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Build the query object dynamically based on search parameters
        const query: Record<string, unknown> = {};

        if (searchParams.has('id')) {
            const id = parseInt(searchParams.get('id') || '0', 10);
            if (isNaN(id)) {
                return NextResponse.json({ message: 'Invalid ID value' }, { status: 400 });
            }
            query.id = id;
        }

        if (searchParams.has('name')) {
            const name = searchParams.get('name');
            // Use $regex for partial matching (case-insensitive)
            query.name = { $regex: name, $options: 'i' };
        }

        if (searchParams.has('email')) {
            const email = searchParams.get('email');
            // Use $regex for partial matching (case-insensitive)
            query.email = { $regex: email, $options: 'i' };
        }

        if (searchParams.has('age')) {
            const age = parseInt(searchParams.get('age') || '0', 10);
            if (isNaN(age)) {
                return NextResponse.json({ message: 'Invalid age value' }, { status: 400 });
            }
            query.age = age;
        }

        if (searchParams.has('city')) {
            const city = searchParams.get('city');
            // Use $regex for partial matching (case-insensitive)
            query.city = { $regex: city, $options: 'i' };
        }

        if (searchParams.has('country')) {
            const country = searchParams.get('country');
            // Use $regex for partial matching (case-insensitive)
            query.country = { $regex: country, $options: 'i' };
        }

        if (searchParams.has('phone')) {
            const phone = searchParams.get('phone');
            // Use $regex for partial matching (case-insensitive)
            if (phone !== null) {
                query.phone = { $regex: phone.replace(/\\/g, '\\\\'), $options: 'i' };
            }
        }

        if (searchParams.has('occupation')) {
            const occupation = searchParams.get('occupation');
            // Use $regex for partial matching (case-insensitive)
            query.occupation = { $regex: occupation, $options: 'i' };
        }

        if (searchParams.has('company')) {
            const company = searchParams.get('company');
            // Use $regex for partial matching (case-insensitive)
            query.company = { $regex: company, $options: 'i' };
        }

        if (searchParams.has('active')) {
            const active = searchParams.get('active');
            if (active === 'true') {
                query.active = true;
            } else if (active === 'false') {
                query.active = false;
            } else {
                return NextResponse.json({ message: 'Invalid active value' }, { status: 400 });
            }
        }

        console.log("this is query ............................................................. ", query)

        // Fetch users based on the constructed query
        // const users = await usersCollection.find(query).limit(20).toArray();
        const page = parseInt(searchParams.get('page') || '1', 10);
        if (isNaN(page) || page < 1) {
            return NextResponse.json({ message: 'Invalid page value' }, { status: 400 });
        }

        // const totalUsers = await usersCollection.countDocuments(query);
        // const totalPages = Math.ceil(totalUsers / 20);
        const users = await usersCollection.find(query)
            .skip((page - 1) * 20)
            .limit(20)
            .toArray();

        // const response = {
        //     users,
        //     totalUsers,
        //     totalPages,
        //     currentPage: page,
        // };


        // Return the users as JSON response
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred while fetching users' },
            { status: 500 }
        );
    }
}