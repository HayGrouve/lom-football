import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/index.module.css";

interface dbPlayers {
  id: number;
  created_at: string;
  name: string;
}

const Home: NextPage = () => {
  const [localPlayers, setPlayers] = useState<dbPlayers[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const addPlayer = async () => {
    const { error } = await supabase
      .from("players")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      .insert({ id: uuidv4(), name: playerName });
    if (error) console.log("error", error);
    setPlayerName("");
    setIsRefresh(!isRefresh);
  };

  const removePlayer = async (playerID: number) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerID);
    if (error) console.log("error", error);
    setIsRefresh(!isRefresh);
  };

  const getPlayers = async () => {
    const { data: name, error } = await supabase
      .from("players")
      .select("*")
      .order("id");
    if (error) console.log("error", error);
    else setPlayers(name);
  };

  const deleteAllPlayers = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    localPlayers.forEach(async (player) => {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", player.id);
      if (error) console.log("error", error);
      setIsRefresh(!isRefresh);
    });
  };

  useEffect(() => {
    void getPlayers();
  }, [isRefresh]);

  return (
    <>
      <Head>
        <title>Football Lom</title>
        <meta
          name="This site is about people playing football"
          content="Made by Tsvetomir Tsekov"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span onClick={() => setIsAdmin(!isAdmin)}>L</span>omski{" "}
            <span className={"text-green-600"}>FOOTBALL</span>
          </h1>
          <div className={styles.container}>
            <label htmlFor="player">Zapishi se:</label>
            <input
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  void addPlayer();
                }
              }}
              onChange={(e) => setPlayerName(e.target.value)}
              value={playerName}
              type="text"
              id="first_name"
              className={
                "rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              }
              placeholder="Patriciq"
              required
            />
            <button
              onClick={() => void addPlayer()}
              type="submit"
              className="cursor-pointer rounded bg-green-700
      px-5 py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Ok
            </button>
            {isAdmin && (
              <button
                onClick={() => void deleteAllPlayers()}
                type="submit"
                className="cursor-pointer rounded bg-red-700
            px-5 py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                X
              </button>
            )}
          </div>

          <div className="relative overflow-x-auto">
            <table className="text-md w-full text-left text-gray-200 dark:text-gray-300">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {localPlayers.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      {item.name}
                      {isAdmin && (
                        <button
                          onClick={() => void removePlayer(item.id)}
                          className={
                            "ml-3 cursor-pointer text-red-500 hover:text-red-400"
                          }
                        >
                          {" "}
                          X
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
