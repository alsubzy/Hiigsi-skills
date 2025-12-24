import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/services/audit";

async function GET_Handler(req: Request) {
  try {
    const staff = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: { notIn: ["Student", "Parent"] } // Focus on staff
            }
          }
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

async function POST_Handler(req: Request) {
  try {
    const body = await req.json();
    // Example: Create staff member...

    // Log Audit
    // await logAudit({
    //   userId: "current-user-id",
    //   action: "CREATE",
    //   resource: "STAFF",
    //   payload: body
    // });

    return NextResponse.json({ message: "Staff created (example)" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

// Protect the routes
export const GET = withAuth("READ", "STAFF", GET_Handler);
export const POST = withAuth("CREATE", "STAFF", POST_Handler);
