import { supabase } from "@/app/supabaseSetup";
import { NextResponse } from "next/server";

export const POST = async (req,{params}) => {
    try {
        const formData = await req.json();
        const { checkInId } = await params;

        const { data, error } = await supabase.from("CheckIn").eq("id",checkInId).insert([
            {
                to_time: formData.toTime,
            },
        ]);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (err) {
        console.error("Error submitting form data:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};


