import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  const requests = await prisma.withdrawalRequest.findMany({
    where: { status: "pending" },
    include: { user: true },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Withdrawals");

  sheet.columns = [
    { header: "User Email", key: "email" },
    { header: "Method", key: "method" },
    { header: "Details", key: "details" },
    { header: "Amount", key: "amount" },
    { header: "Status", key: "status" },
  ];

  requests.forEach((req) => {
    sheet.addRow({
      email: req.user.email,
      method: req.method,
      details: req.details,
      amount: req.amount,
      status: req.status,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=withdrawals.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
