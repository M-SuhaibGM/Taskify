"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";



export  async function create(formData:FormData) {
    const title=formData.get("title") as string


    await  db.board.create({
        data: {
            title,
        }
    });



    revalidatePath("/organization/org_2uV4ijvJKnf3SwkyAhpoVlwkdvM")
}                  