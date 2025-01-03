import { supabase } from "@/app/supabaseSetup";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const { params } = context; 
        const id = params?.id; 

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('Crew')
            .select('*')
            .eq('cms_id', id)
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


export async function PUT(request, context) {
    try {
        const { params } = context;
        const id = params?.id;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const { data: existingData, error: existingError } = await supabase
            .from('Crew')
            .select('*')
            .eq('cms_id', id)
            .single();

        if (existingError) {
            return NextResponse.json({ error: existingError.message }, { status: 500 });
        }

        if (!existingData) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        const body = await request.json();
        const { data, error } = await supabase
            .from('Crew')
            .update(body)
            .eq('cms_id', id)
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