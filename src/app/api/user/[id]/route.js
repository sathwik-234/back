import {supabase} from "@/app/supabaseSetup"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    try {
        const id = await params?.id;

        const { data, error } = await supabase
            .from('Crew')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Error in API handler:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
