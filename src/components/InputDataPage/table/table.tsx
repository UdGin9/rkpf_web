import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const TableData = () => {

  const [rows, setRows] = useState<Array<{
    id: number;
    data:string;
    sigma: string;
    oneMinusSigma: string;
    theta: string;
    oneMinusTheta: string;
    product: string;
  }>>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      data: "",
      sigma: "",
      oneMinusSigma: "",
      theta: "",
      oneMinusTheta: "",
      product: "",
    }))
  );

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {["Данные", "σ", "1-σ", "θ", "1-θ", "(1-σ)*(1-θ)"].map((header) => (
              <TableHead
                key={header}
                className="text-center font-semibold bg-gray-200 border-b border-gray-300 py-3 align-middle">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className={row.id % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >

              <TableCell className="text-center font-medium border-r border-gray-200 h-10 px-2">
                <Input
                  type="text"
                  value={row.data}
                  className="h-full p-0 text-center focus-visible:ring-1 focus-visible:ring-blue-400"
                  placeholder="0"
                />
              </TableCell>

              <TableCell className="text-center font-mono border-r border-gray-200 h-10">
                {row.sigma || " "}
              </TableCell>
              <TableCell className="text-center font-mono border-r border-gray-200 h-10">
                {row.oneMinusSigma || " "}
              </TableCell>
              <TableCell className="text-center font-mono border-r border-gray-200 h-10">
                {row.theta || " "}
              </TableCell>
              <TableCell className="text-center font-mono border-r border-gray-200 h-10">
                {row.oneMinusTheta || " "}
              </TableCell>
              <TableCell className="text-center font-mono border-r border-gray-200 h-10">
                {row.product || " "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};