import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../@/components/ui/table";
import type { dbPlayers } from "../pages";
import { Checkbox } from "../../@/components/ui/checkbox";

type TableDemoProps = {
  removePlayer: (playerID: number) => void;
  isAdmin: boolean;
  players: dbPlayers[];
};

export function TableDemo({ players, isAdmin, removePlayer }: TableDemoProps) {
  return (
    <Table className="bg-slate-100">
      <TableHeader>
        <TableRow>
          <TableHead className="p-5">#</TableHead>
          <TableHead className="p-5">Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow className="text-lg" key={player.id}>
            <TableCell className="p-5">{++index}</TableCell>
            <TableCell className="flex flex-wrap items-center justify-between gap-4 p-5">
              {player.name}
              {isAdmin && (
                <Checkbox
                  onClick={() => removePlayer(player.id)}
                  className="h-4 w-4 rounded-lg border-red-500"
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
